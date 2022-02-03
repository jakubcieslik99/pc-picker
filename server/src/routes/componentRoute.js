import express from 'express'
import createError from 'http-errors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { Readable } from 'stream'
import { promisify } from 'util'
import databasePool from '../config/databaseConnect'
import { isValidId } from '../middlewares/paramsMiddleware'
import { isAuth } from '../middlewares/authMiddleware'
import { isPageLimit } from '../middlewares/paginationMiddleware'
import { updateValidation, createValidation, listSpecificValidation } from '../validations/componentValidation'

const router = express.Router()
const upload = multer()
const pipeline = promisify(require('stream').pipeline)

//delete component (admin can delete every single)
router.delete('/:id', isValidId('id'), isAuth, async (req, res, next) => {
    try {
        const possibleAdmin = req.checkedUser.isAdmin

        const [deleteComponent, _] = await databasePool.execute(`SELECT * FROM components WHERE id=${parseInt(req.params.id)} LIMIT 1;`)
        if(deleteComponent.length<=0) throw createError(404, 'Podany komponent nie istnieje.')

        if(deleteComponent[0].addedBy===req.user.id || possibleAdmin) {
            const isCase = deleteComponent[0].type==='case' ? true : false

            if(isCase) await databasePool.execute('UPDATE setups_components SET component_id=? WHERE component_id=?;', [1, deleteComponent[0].id])
            else await databasePool.execute(`DELETE FROM setups_components WHERE component_id=${deleteComponent[0].id};`)

            deleteComponent[0].image!==null && fs.unlinkSync(`${__dirname}/../../uploads/${deleteComponent[0].image}`)
            
            await databasePool.execute(`DELETE FROM components WHERE id=${deleteComponent[0].id};`)
    
            return res.status(200).send({message: 'Usunięto komponent.'})
        }
        else throw createError(403, 'Brak wystarczających uprawnień.')
    } 
    catch(error) {
        console.log(error)
        return next(error)
    }
})
//update component (admin can update every single)
router.put('/:id', isValidId('id'), isAuth, upload.array('componentSelectedFiles'), async (req, res, next) => {
    try {
        const possibleAdmin = req.checkedUser.isAdmin

        const validationResult = await updateValidation.validateAsync({
            type: req.body.type,
            name: req.body.name,
            link: req.body.link,
            caseCompatibility: req.body.caseCompatibility,
            cpuCompatibility: req.body.cpuCompatibility,
            ramCompatibility: req.body.ramCompatibility
        })

        let caseCompatibility = null, cpuCompatibility = null, ramCompatibility = null
        if(validationResult.type==='case' || validationResult.type==='mobo') caseCompatibility = validationResult.caseCompatibility
        if(validationResult.type==='cpu' || validationResult.type==='mobo') cpuCompatibility = validationResult.cpuCompatibility
        if(validationResult.type==='cpu' || validationResult.type==='mobo' || validationResult.type==='ram') ramCompatibility = validationResult.ramCompatibility

        const [updateComponent, _] = await databasePool.execute(`SELECT * FROM components WHERE id=${parseInt(req.params.id)} LIMIT 1;`)
        if(updateComponent.length<=0) throw createError(404, 'Podany komponent nie istnieje.')

        if(updateComponent[0].addedBy==req.user.id || possibleAdmin) {
            let files = [], filesToKeep = [], filesToUpload = [], filesToSet = []
            if(Array.isArray(req.body.componentFetchedFiles)) files = req.body.componentFetchedFiles
            else if(!Array.isArray(req.body.componentFetchedFiles) && req.body.componentFetchedFiles!==undefined) files.push(req.body.componentFetchedFiles)

            if(files.length>1) throw createError(422, 'Przesłano błędne dane.')
            else if(req.files.length>(1-files.length)) throw createError(406, 'Przesłano zbyt dużo plików.')
            else {
                if(updateComponent[0].image!==null) {
                    if(files.includes(updateComponent[0].image)) filesToKeep.push(updateComponent[0].image)
                    else fs.unlinkSync(path.join(__dirname, `/../../uploads/${updateComponent[0].image}`))
                }
                /*for(let i=0; i<updateComponent[0].images.length; i++) {
                    if(files.includes(updateComponent[0].images[i])) filesToKeep.push(updateComponent[0].images[i])
                    else fs.unlinkSync(path.join(__dirname, `/../../uploads/${updateComponent[0].id}/${updateComponent[0].images[i]}`))
                }*/

                for(let i=0; i<req.files.length; i++) {
                    const ext = path.extname(req.files[i].originalname)
                    if(ext!=='.png' && ext!=='.jpg' && ext!=='.jpeg') throw createError(406, 'Format przesłanego pliku jest niepoprawny.')
                    if(req.files[i].size>(5*1024*1024)) throw createError(406, 'Rozmiar przesłanego pliku jest za duży.')
                    
                    const filename = `${req.files[i].fieldname}-${Date.now()}_${i}${ext}`

                    await pipeline(Readable.from(req.files[i].buffer), fs.createWriteStream(path.join(__dirname, `/../../uploads/${filename}`)))
                    //await pipeline(stream, fs.createWriteStream(path.join(__dirname, `/../../uploads/${updateComponent[0].id}/${filename}`)))
                    filesToUpload.push(filename)
                }
                filesToSet = filesToKeep.concat(filesToUpload)
            }
            
            if(filesToSet.length<1) filesToSet[0] = null //specified for single file reference in MySQL

            await databasePool.execute('UPDATE components SET type=?, name=?, link=?, image=?, caseCompatibility=?, cpuCompatibility=?, ramCompatibility=? WHERE id=?', [validationResult.type, validationResult.name, validationResult.link, filesToSet[0], caseCompatibility, cpuCompatibility, ramCompatibility, parseInt(req.params.id)])
        }
        else throw createError(403, 'Brak wystarczających uprawnień.')

        const [updatedComponent, __] = await databasePool.execute(`SELECT * FROM components WHERE id=${parseInt(req.params.id)} LIMIT 1;`)

        return res.status(200).send({message: 'Zaktualizowano komponent.', component: updatedComponent[0]})
    }
    catch(error) {
        if(error.isJoi===true) {
            error.status = 422
            error.message = 'Przesłano błędne dane.'
        }
        return next(error)
    }
})
//create component
router.post('/', isAuth, upload.array('componentSelectedFiles'), async (req, res, next) => {
    try {
        const validationResult = await createValidation.validateAsync({
            type: req.body.type,
            name: req.body.name,
            link: req.body.link,
            caseCompatibility: req.body.caseCompatibility,
            cpuCompatibility: req.body.cpuCompatibility,
            ramCompatibility: req.body.ramCompatibility
        })

        let caseCompatibility = null, cpuCompatibility = null, ramCompatibility = null
        if(validationResult.type==='case' || validationResult.type==='mobo') caseCompatibility = validationResult.caseCompatibility
        if(validationResult.type==='cpu' || validationResult.type==='mobo') cpuCompatibility = validationResult.cpuCompatibility
        if(validationResult.type==='cpu' || validationResult.type==='mobo' || validationResult.type==='ram') ramCompatibility = validationResult.ramCompatibility

        //fs.mkdirSync(`${__dirname}/../../uploads/${newComponent[0].id}`, {recursive: false})
        let filename = null
        if(req.files.length>1) throw createError(406, 'Przesłano zbyt dużo plików.')
        else {
            for(let i=0; i<req.files.length; i++) {
                const ext = path.extname(req.files[i].originalname)
                if(ext!=='.png' && ext!=='.jpg' && ext!=='.jpeg') throw createError(406, 'Format przesłanego pliku jest niepoprawny.')
                if(req.files[i].size>(5*1024*1024)) throw createError(406, 'Rozmiar przesłanego pliku jest za duży.')

                filename = `${req.files[i].fieldname}-${Date.now()}_${i}${ext}`

                await pipeline(Readable.from(req.files[i].buffer), fs.createWriteStream(path.join(__dirname, `/../../uploads/${filename}`)))
                //await pipeline(stream, fs.createWriteStream(path.join(__dirname, `/../../uploads/${newComponent[0].id}/${filename}`)))
            }
        }
        
        const [insertNewComponent, _] = await databasePool.execute('INSERT INTO components (type, name, link, image, addedBy, caseCompatibility, cpuCompatibility, ramCompatibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [validationResult.type, validationResult.name, validationResult.link, filename, req.user.id, caseCompatibility, cpuCompatibility, ramCompatibility])
        const [newComponent, __] = await databasePool.execute(`SELECT * FROM components WHERE id='${insertNewComponent.insertId}' LIMIT 1;`)

        return res.status(201).send({message: 'Dodano nowy komponent.', component: newComponent[0]})
    } 
    catch(error) {
        if(error.isJoi===true) {
            error.status = 422
            error.message = 'Przesłano błędne dane.'
        }
        return next(error)
    }
})

//list component details
router.get('/:id', isValidId('id'), async (req, res, next) => {
    try {
        const [component, _] = await databasePool.execute(`SELECT * FROM components WHERE id=${parseInt(req.params.id)} LIMIT 1;`)
        if(component.length<=0) throw createError(404, 'Podany komponent nie istnieje.')

        return res.status(200).send(component[0])
    } 
    catch(error) {
        return next(error)
    }
})

//list specific components
router.get('/type/:type', isPageLimit(6), async (req, res, next) => {
    try {
        const validationResult = await listSpecificValidation.validateAsync({ type: req.params.type })

        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        let query = ''
        let queryCount = ''
        if(req.query.searchKeyword) {
            query = `SELECT components.*, users.nick FROM components INNER JOIN users ON components.addedBy=users.id WHERE components.type='${validationResult.type}' AND components.name LIKE '%${req.query.searchKeyword}%' LIMIT ${limit} OFFSET ${(page - 1) * limit};`
            queryCount = `SELECT components.*, users.nick FROM components INNER JOIN users ON components.addedBy=users.id WHERE components.type='${validationResult.type}' AND components.name LIKE '%${req.query.searchKeyword}%';`
        }
        else {
            query = `SELECT components.*, users.nick FROM components INNER JOIN users ON components.addedBy=users.id WHERE components.type='${validationResult.type}' LIMIT ${limit} OFFSET ${(page - 1) * limit};`
            queryCount = `SELECT components.*, users.nick FROM components INNER JOIN users ON components.addedBy=users.id WHERE components.type='${validationResult.type}';`
        }
        const [components, _] = await databasePool.execute(query)
        const [componentsCount, __] = await databasePool.execute(queryCount)

        return res.status(200).send({count: componentsCount.length, components: components})
    } 
    catch(error) {
        if(error.isJoi===true) {
            error.status = 422
            error.message = 'Przesłano błędne dane.'
        }
        return next(error)
    }
})

export default router
