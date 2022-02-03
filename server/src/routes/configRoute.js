import express from 'express'
import createError from 'http-errors'
import databasePool from '../config/databaseConnect'
import { isValidId } from '../middlewares/paramsMiddleware'
import { isAuth } from '../middlewares/authMiddleware'
import { isPageLimit } from '../middlewares/paginationMiddleware'

const router = express.Router()

//delete config
router.delete('/:id', isValidId('id'), isAuth, async (req, res, next) => {
    try {
        const possibleAdmin = req.checkedUser.isAdmin

        const [deleteConfig, _] = await databasePool.execute(`SELECT * FROM setups WHERE id=${parseInt(req.params.id)} LIMIT 1;`)
        if(deleteConfig.length<=0) throw createError(404, 'Podana konfiguracja nie istnieje.')

        if(deleteConfig[0].composedBy===req.user.id || possibleAdmin) {
            await databasePool.execute(`DELETE FROM setups_components WHERE setup_id=${deleteConfig[0].id}`)
            await databasePool.execute(`DELETE FROM setups WHERE id=${deleteConfig[0].id}`)

            return res.status(200).send({message: 'Usunięto konfigurację.'})
        }
        else throw createError(403, 'Brak wystarczających uprawnień.')
    } 
    catch(error) {
        return next(error)
    }
})
//update config
router.put('/:id', isValidId('id'), isAuth, async (req, res, next) => {
    try {
        const possibleAdmin = req.checkedUser.isAdmin

        const validationResult = {
            id: parseInt(req.params.id),
            caseId: Number.isInteger(req.body.caseId) ? req.body.caseId : null,
            cpuId: Number.isInteger(req.body.cpuId) ? req.body.cpuId : null,
            moboId: Number.isInteger(req.body.moboId) ? req.body.moboId : null,
            ramId: Number.isInteger(req.body.ramId) ? req.body.ramId : null,
            gpuId: Number.isInteger(req.body.gpuId) ? req.body.gpuId : null,
            psuId: Number.isInteger(req.body.psuId) ? req.body.psuId : null,
            driveOneId: Number.isInteger(req.body.driveOneId) ? req.body.driveOneId : null,
            driveTwoId: Number.isInteger(req.body.driveTwoId) ? req.body.driveTwoId : null,
            driveThreeId: Number.isInteger(req.body.driveThreeId) ? req.body.driveThreeId : null,
            driveFourId: Number.isInteger(req.body.driveFourId) ? req.body.driveFourId : null
        }

        const [updateConfig, _] = await databasePool.execute(`SELECT setups.id, setups.composedBy, setups.composedTime, setups_components.component_id FROM setups_components INNER JOIN setups ON setups_components.setup_id=setups.id WHERE setups_components.setup_id=${validationResult.id} LIMIT 1;`)
        if(updateConfig.length<=0) throw createError(404, 'Podana konfiguracja nie istnieje.')

        if(updateConfig[0].composedBy===req.user.id || possibleAdmin) {
            if(!validationResult.caseId) throw createError(422, 'Wybranie obudowy jest wymagane.')

            const [caseComponent, _] = await databasePool.execute(`SELECT * FROM components WHERE id='${validationResult.caseId}' LIMIT 1;`)
            if(caseComponent.length<=0) throw createError(404, 'Podana obudowa nie istnieje.')

            let configSpecs = {
                caseCompatibility: caseComponent[0].caseCompatibility,
                cpuCompatibility: null,
                ramCompatibility: null
            }

            let components = {
                caseComponent: caseComponent[0], //required
                cpuComponent: null,
                moboComponent: null,
                ramComponent: null,
                gpuComponent: null,
                psuComponent: null,
                driveOneComponent: null,
                driveTwoComponent: null,
                driveThreeComponent: null,
                driveFourComponent: null
            }

            if(validationResult.cpuId) {
                const [cpuComponent, _] = await databasePool.execute(`SELECT * FROM components WHERE id='${validationResult.cpuId}' LIMIT 1;`)
                if(cpuComponent.length<=0) throw createError(404, 'Podany procesor nie istnieje.')
                else {
                    configSpecs.cpuCompatibility = cpuComponent[0].cpuCompatibility
                    configSpecs.ramCompatibility = cpuComponent[0].ramCompatibility
                    components.cpuComponent = cpuComponent[0]
                }
            }
            if(validationResult.moboId) {
                const [moboComponent, _] = await databasePool.execute(`SELECT * FROM components WHERE id='${validationResult.moboId}' LIMIT 1;`)
                if(moboComponent.length<=0) throw createError(404, 'Podana płyta główna nie istnieje.')
                else {
                    if(!configSpecs.cpuCompatibility) configSpecs.cpuCompatibility = moboComponent[0].cpuCompatibility
                    if(!configSpecs.ramCompatibility) configSpecs.ramCompatibility = moboComponent[0].ramCompatibility
    
                    if(configSpecs.caseCompatibility==='itx' && moboComponent[0].caseCompatibility!=='itx') throw createError(422, 'Podana płyta główna nie jest kompatybilna z podaną obudową.')
                    else if(configSpecs.caseCompatibility==='dtx' && moboComponent[0].caseCompatibility!=='itx' && moboComponent[0].caseCompatibility!=='dtx') throw createError(422, 'Podana płyta główna nie jest kompatybilna z podaną obudową.')
                    else if(configSpecs.caseCompatibility==='matx' && moboComponent[0].caseCompatibility!=='itx' && moboComponent[0].caseCompatibility!=='dtx' && moboComponent[0].caseCompatibility!=='matx') throw createError(422, 'Podana płyta główna nie jest kompatybilna z podaną obudową.')
                    else if(configSpecs.cpuCompatibility!==moboComponent[0].cpuCompatibility) throw createError(422, 'Podana płyta główna nie jest kompatybilna z podanym procesorem.')
                    else components.moboComponent = moboComponent[0]
                }
            }
            if(validationResult.ramId) {
                const [ramComponent, _] = await databasePool.execute(`SELECT * FROM components WHERE id='${validationResult.ramId}' LIMIT 1;`)
                if(ramComponent.length<=0) throw createError(404, 'Podana pamięć ram nie istnieje.')
                else {
                    if(!configSpecs.ramCompatibility) configSpecs.ramCompatibility = ramComponent[0].ramCompatibility
    
                    if(configSpecs.ramCompatibility!==ramComponent[0].ramCompatibility) throw createError(422, 'Podana pamięć RAM nie jest kompatybilna z podanym procesorem lub płytą główną .')
                    else components.ramComponent = ramComponent[0]
                }
            }
            if(validationResult.gpuId) {
                const [gpuComponent, _] = await databasePool.execute(`SELECT * FROM components WHERE id='${validationResult.gpuId}' LIMIT 1;`)
                if(gpuComponent.length<=0) throw createError(404, 'Podana karta graficzna nie istnieje.')
                else components.gpuComponent = gpuComponent[0]
            }
            if(validationResult.psuId) {
                const [psuComponent, _] = await databasePool.execute(`SELECT * FROM components WHERE id='${validationResult.psuId}' LIMIT 1;`)
                if(psuComponent.length<=0) throw createError(404, 'Podany zasilacz nie istnieje.')
                else components.psuComponent = psuComponent[0]
            }
            if(validationResult.driveOneId) {
                const [driveOneComponent, _] = await databasePool.execute(`SELECT * FROM components WHERE id='${validationResult.driveOneId}' LIMIT 1;`)
                if(driveOneComponent.length<=0) throw createError(404, 'Podany dysk nie istnieje.')
                else components.driveOneComponent = driveOneComponent[0]
            }
            if(validationResult.driveTwoId) {
                const [driveTwoComponent, _] = await databasePool.execute(`SELECT * FROM components WHERE id='${validationResult.driveTwoId}' LIMIT 1;`)
                if(driveTwoComponent.length<=0) throw createError(404, 'Podany dysk nie istnieje.')
                else components.driveTwoComponent = driveTwoComponent[0]
            }
            if(validationResult.driveThreeId) {
                const [driveThreeComponent, _] = await databasePool.execute(`SELECT * FROM components WHERE id='${validationResult.driveThreeId}' LIMIT 1;`)
                if(driveThreeComponent.length<=0) throw createError(404, 'Podany dysk nie istnieje.')
                else components.driveThreeComponent = driveThreeComponent[0]
            }
            if(validationResult.driveFourId) {
                const [driveFourComponent, _] = await databasePool.execute(`SELECT * FROM components WHERE id='${validationResult.driveFourId}' LIMIT 1;`)
                if(driveFourComponent.length<=0) throw createError(404, 'Podany dysk nie istnieje.')
                else components.driveFourComponent = driveFourComponent[0]
            }

            await databasePool.execute(`DELETE FROM setups_components WHERE setup_id=${validationResult.id}`)

            await databasePool.execute('INSERT INTO setups_components (setup_id, component_id) VALUES (?, ?)', [validationResult.id, components.caseComponent.id])
            if(components.cpuComponent) await databasePool.execute('INSERT INTO setups_components (setup_id, component_id) VALUES (?, ?)', [validationResult.id, components.cpuComponent.id])
            if(components.moboComponent) await databasePool.execute('INSERT INTO setups_components (setup_id, component_id) VALUES (?, ?)', [validationResult.id, components.moboComponent.id])
            if(components.ramComponent) await databasePool.execute('INSERT INTO setups_components (setup_id, component_id) VALUES (?, ?)', [validationResult.id, components.ramComponent.id])
            if(components.gpuComponent) await databasePool.execute('INSERT INTO setups_components (setup_id, component_id) VALUES (?, ?)', [validationResult.id, components.gpuComponent.id])
            if(components.psuComponent) await databasePool.execute('INSERT INTO setups_components (setup_id, component_id) VALUES (?, ?)', [validationResult.id, components.psuComponent.id])
            if(components.driveOneComponent) await databasePool.execute('INSERT INTO setups_components (setup_id, component_id) VALUES (?, ?)', [validationResult.id, components.driveOneComponent.id])
            if(components.driveTwoComponent) await databasePool.execute('INSERT INTO setups_components (setup_id, component_id) VALUES (?, ?)', [validationResult.id, components.driveTwoComponent.id])
            if(components.driveThreeComponent) await databasePool.execute('INSERT INTO setups_components (setup_id, component_id) VALUES (?, ?)', [validationResult.id, components.driveThreeComponent.id])
            if(components.driveFourComponent) await databasePool.execute('INSERT INTO setups_components (setup_id, component_id) VALUES (?, ?)', [validationResult.id, components.driveFourComponent.id])

            const updatedConfig = {
                id: updateConfig[0].id,
                composedBy: updateConfig[0].composedBy,
                composedTime: updateConfig[0].composedTime,
                components: components
            }

            return res.status(200).send({message: 'Zaktualizowano konfigurację.', config: updatedConfig})
        }
        else throw createError(403, 'Brak wystarczających uprawnień.')
    }
    catch(error) {
        return next(error)
    }
})
//create config
router.post('/', isAuth, async (req, res, next) => {
    try {
        const validationResult = {
            caseId: Number.isInteger(req.body.caseId) ? req.body.caseId : null,
            cpuId: Number.isInteger(req.body.cpuId) ? req.body.cpuId : null,
            moboId: Number.isInteger(req.body.moboId) ? req.body.moboId : null,
            ramId: Number.isInteger(req.body.ramId) ? req.body.ramId : null,
            gpuId: Number.isInteger(req.body.gpuId) ? req.body.gpuId : null,
            psuId: Number.isInteger(req.body.psuId) ? req.body.psuId : null,
            driveOneId: Number.isInteger(req.body.driveOneId) ? req.body.driveOneId : null,
            driveTwoId: Number.isInteger(req.body.driveTwoId) ? req.body.driveTwoId : null,
            driveThreeId: Number.isInteger(req.body.driveThreeId) ? req.body.driveThreeId : null,
            driveFourId: Number.isInteger(req.body.driveFourId) ? req.body.driveFourId : null
        }

        if(!validationResult.caseId) throw createError(422, 'Wybranie obudowy jest wymagane.')

        const [caseComponent, _] = await databasePool.execute(`SELECT * FROM components WHERE id='${validationResult.caseId}' LIMIT 1;`)
        if(caseComponent.length<=0) throw createError(404, 'Podana obudowa nie istnieje.')

        let configSpecs = {
            caseCompatibility: caseComponent[0].caseCompatibility,
            cpuCompatibility: null,
            ramCompatibility: null
        }

        let components = {
            caseComponent: caseComponent[0], //required
            cpuComponent: null,
            moboComponent: null,
            ramComponent: null,
            gpuComponent: null,
            psuComponent: null,
            driveOneComponent: null,
            driveTwoComponent: null,
            driveThreeComponent: null,
            driveFourComponent: null
        }

        if(validationResult.cpuId) {
            const [cpuComponent, _] = await databasePool.execute(`SELECT * FROM components WHERE id='${validationResult.cpuId}' LIMIT 1;`)
            if(cpuComponent.length<=0) throw createError(404, 'Podany procesor nie istnieje.')
            else {
                configSpecs.cpuCompatibility = cpuComponent[0].cpuCompatibility
                configSpecs.ramCompatibility = cpuComponent[0].ramCompatibility
                components.cpuComponent = cpuComponent[0]
            }
        }
        if(validationResult.moboId) {
            const [moboComponent, _] = await databasePool.execute(`SELECT * FROM components WHERE id='${validationResult.moboId}' LIMIT 1;`)
            if(moboComponent.length<=0) throw createError(404, 'Podana płyta główna nie istnieje.')
            else {
                if(!configSpecs.cpuCompatibility) configSpecs.cpuCompatibility = moboComponent[0].cpuCompatibility
                if(!configSpecs.ramCompatibility) configSpecs.ramCompatibility = moboComponent[0].ramCompatibility

                if(configSpecs.caseCompatibility==='itx' && moboComponent[0].caseCompatibility!=='itx') throw createError(422, 'Podana płyta główna nie jest kompatybilna z podaną obudową.')
                else if(configSpecs.caseCompatibility==='dtx' && moboComponent[0].caseCompatibility!=='itx' && moboComponent[0].caseCompatibility!=='dtx') throw createError(422, 'Podana płyta główna nie jest kompatybilna z podaną obudową.')
                else if(configSpecs.caseCompatibility==='matx' && moboComponent[0].caseCompatibility!=='itx' && moboComponent[0].caseCompatibility!=='dtx' && moboComponent[0].caseCompatibility!=='matx') throw createError(422, 'Podana płyta główna nie jest kompatybilna z podaną obudową.')
                else if(configSpecs.cpuCompatibility!==moboComponent[0].cpuCompatibility) throw createError(422, 'Podana płyta główna nie jest kompatybilna z podanym procesorem.')
                else components.moboComponent = moboComponent[0]
            }
        }
        if(validationResult.ramId) {
            const [ramComponent, _] = await databasePool.execute(`SELECT * FROM components WHERE id='${validationResult.ramId}' LIMIT 1;`)
            if(ramComponent.length<=0) throw createError(404, 'Podana pamięć ram nie istnieje.')
            else {
                if(!configSpecs.ramCompatibility) configSpecs.ramCompatibility = ramComponent[0].ramCompatibility

                if(configSpecs.ramCompatibility!==ramComponent[0].ramCompatibility) throw createError(422, 'Podana pamięć RAM nie jest kompatybilna z podanym procesorem lub płytą główną .')
                else components.ramComponent = ramComponent[0]
            }
        }
        if(validationResult.gpuId) {
            const [gpuComponent, _] = await databasePool.execute(`SELECT * FROM components WHERE id='${validationResult.gpuId}' LIMIT 1;`)
            if(gpuComponent.length<=0) throw createError(404, 'Podana karta graficzna nie istnieje.')
            else components.gpuComponent = gpuComponent[0]
        }
        if(validationResult.psuId) {
            const [psuComponent, _] = await databasePool.execute(`SELECT * FROM components WHERE id='${validationResult.psuId}' LIMIT 1;`)
            if(psuComponent.length<=0) throw createError(404, 'Podany zasilacz nie istnieje.')
            else components.psuComponent = psuComponent[0]
        }
        if(validationResult.driveOneId) {
            const [driveOneComponent, _] = await databasePool.execute(`SELECT * FROM components WHERE id='${validationResult.driveOneId}' LIMIT 1;`)
            if(driveOneComponent.length<=0) throw createError(404, 'Podany dysk nie istnieje.')
            else components.driveOneComponent = driveOneComponent[0]
        }
        if(validationResult.driveTwoId) {
            const [driveTwoComponent, _] = await databasePool.execute(`SELECT * FROM components WHERE id='${validationResult.driveTwoId}' LIMIT 1;`)
            if(driveTwoComponent.length<=0) throw createError(404, 'Podany dysk nie istnieje.')
            else components.driveTwoComponent = driveTwoComponent[0]
        }
        if(validationResult.driveThreeId) {
            const [driveThreeComponent, _] = await databasePool.execute(`SELECT * FROM components WHERE id='${validationResult.driveThreeId}' LIMIT 1;`)
            if(driveThreeComponent.length<=0) throw createError(404, 'Podany dysk nie istnieje.')
            else components.driveThreeComponent = driveThreeComponent[0]
        }
        if(validationResult.driveFourId) {
            const [driveFourComponent, _] = await databasePool.execute(`SELECT * FROM components WHERE id='${validationResult.driveFourId}' LIMIT 1;`)
            if(driveFourComponent.length<=0) throw createError(404, 'Podany dysk nie istnieje.')
            else components.driveFourComponent = driveFourComponent[0]
        }
        
        const [insertNewConfig, __] = await databasePool.execute('INSERT INTO setups (composedBy) VALUES (?)', [req.user.id])
        const [newConfig, ___] = await databasePool.execute(`SELECT * FROM setups WHERE id='${insertNewConfig.insertId}' LIMIT 1;`)

        await databasePool.execute('INSERT INTO setups_components (setup_id, component_id) VALUES (?, ?)', [newConfig[0].id, components.caseComponent.id])
        if(components.cpuComponent) await databasePool.execute('INSERT INTO setups_components (setup_id, component_id) VALUES (?, ?)', [newConfig[0].id, components.cpuComponent.id])
        if(components.moboComponent) await databasePool.execute('INSERT INTO setups_components (setup_id, component_id) VALUES (?, ?)', [newConfig[0].id, components.moboComponent.id])
        if(components.ramComponent) await databasePool.execute('INSERT INTO setups_components (setup_id, component_id) VALUES (?, ?)', [newConfig[0].id, components.ramComponent.id])
        if(components.gpuComponent) await databasePool.execute('INSERT INTO setups_components (setup_id, component_id) VALUES (?, ?)', [newConfig[0].id, components.gpuComponent.id])
        if(components.psuComponent) await databasePool.execute('INSERT INTO setups_components (setup_id, component_id) VALUES (?, ?)', [newConfig[0].id, components.psuComponent.id])
        if(components.driveOneComponent) await databasePool.execute('INSERT INTO setups_components (setup_id, component_id) VALUES (?, ?)', [newConfig[0].id, components.driveOneComponent.id])
        if(components.driveTwoComponent) await databasePool.execute('INSERT INTO setups_components (setup_id, component_id) VALUES (?, ?)', [newConfig[0].id, components.driveTwoComponent.id])
        if(components.driveThreeComponent) await databasePool.execute('INSERT INTO setups_components (setup_id, component_id) VALUES (?, ?)', [newConfig[0].id, components.driveThreeComponent.id])
        if(components.driveFourComponent) await databasePool.execute('INSERT INTO setups_components (setup_id, component_id) VALUES (?, ?)', [newConfig[0].id, components.driveFourComponent.id])

        const config = {
            id: newConfig[0].id,
            composedBy: newConfig[0].composedBy,
            composedTime: newConfig[0].composedTime,
            components: components
        }

        return res.status(201).send({message: 'Dodano nową konfigurację.', config: config})
    } 
    catch(error) {
        return next(error)
    }
})

//list config details
router.get('/:id', isValidId('id'), async (req, res, next) => {
    try {
        const [configRaw, _] = await databasePool.execute(`SELECT setups_components.setup_id, setups.composedBy, users.nick, setups.composedTime, setups_components.component_id, components.type, components.name, components.link, components.image, components.addedBy, components.addedTime, components.caseCompatibility, components.cpuCompatibility, components.ramCompatibility, users2.nick AS componentNick FROM setups_components INNER JOIN setups ON setups_components.setup_id=setups.id INNER JOIN components ON setups_components.component_id=components.id INNER JOIN users ON setups.composedBy=users.id INNER JOIN users AS users2 ON components.addedBy=users2.id WHERE setups_components.setup_id=${parseInt(req.params.id)};`)
        if(configRaw.length<=0) throw createError(404, 'Podana konfiguracja nie istnieje.')
        else {
            let config = {
                id: configRaw[0].setup_id,
                composedBy: configRaw[0].composedBy,
                nick: configRaw[0].nick,
                composedTime: configRaw[0].composedTime,
                case: null,
                cpu: null,
                mobo: null,
                ram: null,
                gpu: null,
                psu: null,
                driveOne: null,
                driveTwo: null,
                driveThree: null,
                driveFour: null,
            }

            for(let i=0; i<configRaw.length; i++) {
                let component = {
                    id: configRaw[i].component_id,
                    type: configRaw[i].type,
                    name: configRaw[i].name,
                    link: configRaw[i].link,
                    image: configRaw[i].image,
                    addedBy: configRaw[i].addedBy,
                    addedTime: configRaw[i].addedTime,
                    caseCompatibility: configRaw[i].caseCompatibility,
                    cpuCompatibility: configRaw[i].cpuCompatibility,
                    ramCompatibility: configRaw[i].ramCompatibility,
                    nick: configRaw[i].componentNick
                }

                if(configRaw[i].type==='case') config.case = component
                else if(configRaw[i].type==='cpu') config.cpu = component
                else if(configRaw[i].type==='mobo') config.mobo = component
                else if(configRaw[i].type==='ram') config.ram = component
                else if(configRaw[i].type==='gpu') config.gpu = component
                else if(configRaw[i].type==='psu') config.psu = component
                else if(configRaw[i].type==='drive') {
                    if(!config.driveOne) config.driveOne = component
                    else if(!config.driveTwo) config.driveTwo = component
                    else if(!config.driveThree) config.driveThree = component
                    else config.driveFour = component
                }
            }

            return res.status(200).send(config)
        }
    } 
    catch(error) {
        return next(error)
    }
})

//list configs
router.get('/', isPageLimit(9), async (req, res, next) => {
    try {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        let sortOrder = 'DESC'
        if(req.query.sortOrder && req.query.sortOrder==='date_oldest') sortOrder = 'ASC'

        let searchKeyword=''
        if(req.query.searchKeyword && req.query.searchKeyword!=='undefined') searchKeyword = req.query.searchKeyword

        const [configsCount, _] = await databasePool.execute(`SELECT setups_components.setup_id FROM setups_components INNER JOIN setups ON setups_components.setup_id=setups.id INNER JOIN components ON setups_components.component_id=components.id WHERE components.name LIKE '%${searchKeyword}%' GROUP BY setups_components.setup_id ORDER BY setups.composedTime ${sortOrder} LIMIT ${limit} OFFSET ${(page - 1) * limit};`)
        const [configsCountAll, __] = await databasePool.execute(`SELECT * FROM setups;`)

        let configsIds = 'WHERE setups_components.setup_id IN ('
        if(configsCount.length>0) {
            configsIds += configsCount[0].setup_id
            for(let i=1; i<configsCount.length; i++) configsIds += ',' + configsCount[i].setup_id
            configsIds += ')'
        }
        else configsIds += 'null)'

        const [configsRaw, ___] = await databasePool.execute(`SELECT setups_components.setup_id, setups.composedBy, users.nick, setups.composedTime, setups_components.component_id, components.type, components.name, components.image FROM setups_components INNER JOIN setups ON setups_components.setup_id=setups.id INNER JOIN components ON setups_components.component_id=components.id INNER JOIN users ON setups.composedBy=users.id ${configsIds} ORDER BY setups.composedTime ${sortOrder};`)

        let configs = []
        if(configsRaw.length>0) {
            let config = {
                id: configsRaw[0].setup_id,
                composedBy: configsRaw[0].composedBy,
                nick: configsRaw[0].nick,
                composedTime: configsRaw[0].composedTime,
                case: null,
                cpu: null,
                mobo: null,
                ram: null,
                gpu: null,
                psu: null,
                driveOne: null,
                driveTwo: null,
                driveThree: null,
                driveFour: null,
            }

            for(let i=0; i<configsRaw.length; i++) {
                let component = {
                    id: configsRaw[i].component_id,
                    name: configsRaw[i].name,
                    image: configsRaw[i].image
                }

                if(configsRaw[i].type==='case') config.case = component
                else if(configsRaw[i].type==='cpu') config.cpu = component
                else if(configsRaw[i].type==='mobo') config.mobo = component
                else if(configsRaw[i].type==='ram') config.ram = component
                else if(configsRaw[i].type==='gpu') config.gpu = component
                else if(configsRaw[i].type==='psu') config.psu = component
                else if(configsRaw[i].type==='drive') {
                    if(!config.driveOne) config.driveOne = component
                    else if(!config.driveTwo) config.driveTwo = component
                    else if(!config.driveThree) config.driveThree = component
                    else config.driveFour = component
                }

                if(configsRaw[i+1] && configsRaw[i].setup_id!==configsRaw[i+1].setup_id) {
                    configs.push(config)
                    config = {
                        id: configsRaw[i+1].setup_id,
                        composedBy: configsRaw[i+1].composedBy,
                        nick: configsRaw[i+1].nick,
                        composedTime: configsRaw[i+1].composedTime,
                        case: null,
                        cpu: null,
                        mobo: null,
                        ram: null,
                        gpu: null,
                        psu: null,
                        driveOne: null,
                        driveTwo: null,
                        driveThree: null,
                        driveFour: null,
                    }
                }
                else if(!configsRaw[i+1]) configs.push(config)
            }
        }

        return res.status(200).send({count: configsCountAll.length, configs: configs})
    } 
    catch(error) {
        return next(error)
    }
})

export default router
