import express from 'express'
import createError from 'http-errors'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import databasePool from '../config/databaseConnect'
import config from '../config/environmentVariables'
import { isValidId } from '../middlewares/paramsMiddleware'
import { getToken, isAuth } from '../middlewares/authMiddleware'
import { updateValidation, loginValidation, registerValidation, userConfirmEmailValidation, userConfirmValidation, passwordResetEmailValidation, passwordResetValidation } from '../validations/userValidation'

const router = express.Router()

const sendMail = async (message) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.GMAIL_ADDRESS,
            pass: config.GMAIL_PASS
        }
    })

    await transporter.sendMail(message)
}

//list user profile
router.get('/:id', isValidId('id'), async (req, res, next) => {
    try {
        const [user, _] = await databasePool.execute(`SELECT * FROM users WHERE id=${parseInt(req.params.id)} LIMIT 1;`)
        if(user.length<=0) throw createError(404, 'Podany użytkownik nie istnieje.')

        const [userComponents, __] = await databasePool.execute(`SELECT * FROM components WHERE addedBy=${parseInt(req.params.id)} ORDER BY addedTime DESC;`)

        const [userConfigsRaw, ___] = await databasePool.execute(`SELECT setups_components.setup_id, setups.composedTime, setups_components.component_id, components.type, components.name, components.image FROM setups_components INNER JOIN setups ON setups_components.setup_id=setups.id INNER JOIN components ON setups_components.component_id=components.id WHERE setups.composedBy=${parseInt(req.params.id)} ORDER BY setups.composedTime DESC;`)

        let userConfigs = []
        if(userConfigsRaw.length>0) {
            let userConfig = {
                id: userConfigsRaw[0].setup_id,
                composedTime: userConfigsRaw[0].composedTime,
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

            for(let i=0; i<userConfigsRaw.length; i++) {
                let component = {
                    id: userConfigsRaw[i].component_id,
                    name: userConfigsRaw[i].name,
                    image: userConfigsRaw[i].image
                }

                if(userConfigsRaw[i].type==='case') userConfig.case = component
                else if(userConfigsRaw[i].type==='cpu') userConfig.cpu = component
                else if(userConfigsRaw[i].type==='mobo') userConfig.mobo = component
                else if(userConfigsRaw[i].type==='ram') userConfig.ram = component
                else if(userConfigsRaw[i].type==='gpu') userConfig.gpu = component
                else if(userConfigsRaw[i].type==='psu') userConfig.psu = component
                else if(userConfigsRaw[i].type==='drive') {
                    if(!userConfig.driveOne) userConfig.driveOne = component
                    else if(!userConfig.driveTwo) userConfig.driveTwo = component
                    else if(!userConfig.driveThree) userConfig.driveThree = component
                    else userConfig.driveFour = component
                }

                if(userConfigsRaw[i+1] && userConfigsRaw[i].setup_id!==userConfigsRaw[i+1].setup_id) {
                    userConfigs.push(userConfig)
                    userConfig = {
                        id: userConfigsRaw[i+1].setup_id,
                        composedTime: userConfigsRaw[i+1].composedTime,
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
                else if(!userConfigsRaw[i+1]) userConfigs.push(userConfig)
            }
        }

        return res.status(200).send({
            nick: user[0].nick,
            isAdmin: user[0].isAdmin,
            components: userComponents,
            configs: userConfigs
        })
    }
    catch(error) {
        return next(error)
    }
})

//fetch user
router.post('/fetch', isAuth, async (req, res, next) => {
    try {
        res.status(200).send()
    } 
    catch(error) {
        return next(error)
    }
})
//update user
router.put('/update', isAuth, async (req, res, next) => {
    try {
        if(req.user.id!==parseInt(req.body.id)) throw createError(422, 'Przesłano błędne dane.')

        const validationResult = await updateValidation.validateAsync({
            email: req.body.email,
            nick: req.body.nick,
            password: req.body.password,
            newpassword: req.body.newpassword,
            newrepassword: req.body.newrepassword
        })

        const [conflictUserEmail, _] = await databasePool.execute(`SELECT * FROM users WHERE email='${validationResult.email}' LIMIT 1;`)
        if(conflictUserEmail.length>0 && conflictUserEmail[0].id!==parseInt(req.body.id)) throw createError(409, 'Istnieje już użytkownik o podanym adresie e-mail.')
        const [conflictUserNick, __] = await databasePool.execute(`SELECT * FROM users WHERE nick='${validationResult.nick}' LIMIT 1;`)
        if(conflictUserNick.length>0 && conflictUserNick[0].id!==parseInt(req.body.id)) throw createError(409, 'Istnieje już użytkownik o podanym nicku.')

        const [updateUser, ___] = await databasePool.execute(`SELECT * FROM users WHERE id=${parseInt(req.body.id)} LIMIT 1;`)
        if(updateUser.length<=0) throw createError(404, 'Podany użytkownik nie istnieje.')

        const checkPassword = await bcrypt.compare(validationResult.password, updateUser[0].password)
        if(!checkPassword) throw createError(401, 'Błędne hasło.')

        let hashedPassword = updateUser[0].password
        if(validationResult.newpassword!=='') {
            const salt = await bcrypt.genSalt(10)
            hashedPassword = await bcrypt.hash(validationResult.newpassword, salt)
        }
        await databasePool.execute('UPDATE users SET email=?, nick=?, password=? WHERE id=?;', [validationResult.email, validationResult.nick, hashedPassword, parseInt(req.body.id)])
        const [updatedUser, ____] = await databasePool.execute(`SELECT * FROM users WHERE id=${parseInt(req.body.id)} LIMIT 1;`)
        
        const generateToken = await getToken(updatedUser[0])

        return res.status(200).send({
            message: 'Zaktualizowano profil.', 
            data: {
                id: updatedUser[0].id,
                email: updatedUser[0].email,
                nick: updatedUser[0].nick,
                isAdmin: updatedUser[0].isAdmin,
                token: generateToken
            }
        })
    } 
    catch(error) {
        if(error.isJoi===true) {
            error.status = 422
            error.message = 'Przesłano błędne dane.'
        }
        return next(error)
    }
})
//login user
router.post('/login', async (req, res, next) => {
    try {
        const validationResult = await loginValidation.validateAsync(req.body)
        
        const [signinUser, _] = await databasePool.execute(`SELECT * FROM users WHERE email='${validationResult.email}' LIMIT 1;`)
        if(signinUser.length<=0) throw createError(404, 'Konto użytkownika nie istnieje lub zostało usunięte.')

        if(!signinUser[0].confirmed) throw createError(401, 'E-mail nie został potwierdzony.')

        const checkPassword = await bcrypt.compare(validationResult.password, signinUser[0].password)
        if(!checkPassword) throw createError(401, 'Błędny e-mail lub hasło.')

        const generateToken = await getToken(signinUser[0])

        return res.status(200).send({
            id: signinUser[0].id,
            nick: signinUser[0].nick,
            email: signinUser[0].email,
            isAdmin: signinUser[0].isAdmin,
            token: generateToken
        })
    } 
    catch(error) {
        if(error.isJoi===true) {
            error.status = 422
            error.message = 'Przesłano błędne dane.'
        }
        return next(error)
    }
})
//register user
router.post('/register', async (req, res, next) => {
    try {
        const validationResult = await registerValidation.validateAsync(req.body)

        const [conflictUserEmail, _] = await databasePool.execute(`SELECT * FROM users WHERE email='${validationResult.email}' LIMIT 1;`)
        if(conflictUserEmail.length>0) throw createError(409, 'Istnieje już użytkownik o podanym adresie e-mail.')
        const [conflictUserNick, __] = await databasePool.execute(`SELECT * FROM users WHERE nick='${validationResult.nick}' LIMIT 1;`)
        if(conflictUserNick.length>0) throw createError(409, 'Istnieje już użytkownik o podanym nicku.')

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(validationResult.password, salt)

        const token = crypto.randomBytes(64).toString('hex')
        await databasePool.execute('INSERT INTO users (email, nick, password, token) VALUES (?, ?, ?, ?)', [validationResult.email, validationResult.nick, hashedPassword, token])

        const userConfirmationMessage = {
            from: `PC Picker <${config.NOREPLY_ADDRESS}>`,
            to: validationResult.email,
            subject: `PC Picker - Potwierdź adres e-mail`,
            text: `
                Witaj ${validationResult.nick}! 
                Dziękujemy za rejestrację w PC Picker. 
                Proszę skopiuj i wklej w przeglądarce poniższy link w celu potwierdzenia swojego konta w serwisie.
                ${config.APP_URL}/login?token=${token}
            `,
            html: `
                <h1>Witaj ${validationResult.nick}!</h1>
                <h4>Dziękujemy za rejestrację w PC Picker.</h4>
                <p>Proszę kliknij poniższy link w celu potwierdzenia swojego konta w serwisie.</p>
                <a href="${config.APP_URL}/login?token=${token}">Potwierdź</a>
            `
        }
        sendMail(userConfirmationMessage)

        return res.status(201).send({message: 'Zarejestrowano pomyślnie. Potwierdź konto aby się zalogować.'})
    } 
    catch(error) {
        if(error.isJoi===true) {
            error.status = 422
            error.message = 'Przesłano błędne dane.'
        }
        return next(error)
    }
})

//resend user confirmation link  //Not implemented yet
router.post('/confirm/link', async (req, res, next) => {
    try {
        const validationResult = await userConfirmEmailValidation.validateAsync(req.body)

        const [userConfirmationUser, _] = await databasePool.execute(`SELECT * FROM users WHERE email='${validationResult.email}' LIMIT 1;`)
        if(userConfirmationUser.length<=0) throw createError(404, 'Konto użytkownika nie istnieje.')

        const checkPassword = await bcrypt.compare(validationResult.password, userConfirmationUser[0].password)
        if(!checkPassword) throw createError(401, 'Błędny e-mail lub hasło.')

        if(userConfirmationUser[0].confirmed) throw createError(409, 'E-mail został już potwierdzony.')

        const token = crypto.randomBytes(64).toString('hex')
        await databasePool.execute('UPDATE users SET token=? WHERE id=?', [token, userConfirmationUser[0].id])

        const userConfirmationMessage = {
            from: `PC Picker <${config.NOREPLY_ADDRESS}>`,
            to: validationResult.email,
            subject: `PC Picker - Potwierdź adres e-mail`,
            text: `
                Witaj ${userConfirmationUser[0].nick}! 
                Dziękujemy za rejestrację w PC Picker. 
                Proszę skopiuj i wklej w przeglądarce poniższy link w celu potwierdzenia swojego konta w serwisie.
                ${config.APP_URL}/login?token=${token}
            `,
            html: `
                <h1>Witaj ${userConfirmationUser[0].nick}!</h1>
                <h4>Dziękujemy za rejestrację w Discount.</h4>
                <p>Proszę kliknij poniższy link w celu potwierdzenia swojego konta w serwisie.</p>
                <a href="${config.APP_URL}/login?token=${token}">Potwierdź</a>
            `
        }
        sendMail(userConfirmationMessage)

        return res.status(200).send({message: 'Wysłano potwierdzenie ponownie. Teraz potwierdź e-mail aby się zalogować.'})
    } 
    catch(error) {
        if(error.isJoi===true) {
            error.status = 422
            error.message = 'Przesłano błędne dane.'
        }
        return next(error)
    }
})
//confirm user
router.post('/confirm', async (req, res, next) => {
    try {
        const validationResult = await userConfirmValidation.validateAsync(req.body)

        const [userConfirmationUser, _] = await databasePool.execute(`SELECT * FROM users WHERE token='${validationResult.token}' LIMIT 1;`)
        if(userConfirmationUser.length<=0) throw createError(406, 'Błąd weryfikacji. Konto mogło zostać już potwierdzone.')

        await databasePool.execute('UPDATE users SET confirmed=?, token=? WHERE id=?', [true, null, userConfirmationUser[0].id])

        return res.status(200).send({message: 'Potwierdzono konto pomyślnie. Teraz możesz się zalogować.'})
    } 
    catch(error) {
        if(error.isJoi===true) {
            error.status = 422
            error.message = 'Przesłano błędne dane.'
        }
        return next(error)
    }
})

//send password reset link  //Not implemented yet
router.post('/reset/link', async (req, res, next) => {
    try {
        const validationResult = await passwordResetEmailValidation.validateAsync(req.body)

        const [passwordResetUser, _] = await databasePool.execute(`SELECT * FROM users WHERE email='${validationResult.email}' LIMIT 1;`)
        if(passwordResetUser.length<=0) throw createError(404, 'Konto użytkownika nie istnieje.')

        const token = crypto.randomBytes(64).toString('hex')
        await databasePool.execute('UPDATE users SET token=? WHERE id=?', [token, passwordResetUser[0].id])

        const passwordResetMessage = {
            from: `PC Picker <${config.NOREPLY_ADDRESS}>`,
            to: validationResult.email,
            subject: `PC Picker - Zresetuj hasło`,
            text: `
                Witaj ${passwordResetUser[0].nick}!
                Na Twoim koncie została wygenerowana prośba o zresetowanie hasła. Jeśli to nie Ty ją wygenerowałeś, zignoruj tą wiadomość.
                Proszę skopiuj i wklej w przeglądarce poniższy link w celu zresetowania swojego hasła w serwisie.
                ${config.APP_URL}/reset?token=${token}
            `,
            html: `
                <h1>Witaj ${passwordResetUser[0].nick}!</h1>
                <h4>Na Twoim koncie została wygenerowana prośba o zresetowanie hasła. Jeśli to nie Ty ją wygenerowałeś, zignoruj tą wiadomość. </h4>
                <p>Proszę kliknij poniższy link w celu zresetowania swojego hasła w serwisie.</p>
                <a href="${config.APP_URL}/reset?token=${token}">Ustaw nowe hasło</a>
            `
        }
        sendMail(passwordResetMessage)

        return res.status(200).send({message: 'Wysłano wiadomość z linkiem do resetowania hasła.'})
    } 
    catch(error) {
        if(error.isJoi===true) {
            error.status = 422
            error.message = 'Przesłano błędne dane.'
        }
        return next(error)
    }
})
//confirm password recovery  //Not implemented yet
router.post('/reset', async (req, res, next) => {
    try {
        const validationResult = await passwordResetValidation.validateAsync(req.body)

        const [passwordResetUser, _] = await databasePool.execute(`SELECT * FROM users WHERE token='${validationResult.token}' LIMIT 1;`)
        if(passwordResetUser.length<=0) throw createError(406, 'Błąd resetowania hasła.')

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(validationResult.password, salt)
        await databasePool.execute('UPDATE users SET token=?, password=? WHERE id=?', [null, hashedPassword, passwordResetUser[0].id])

        return res.status(200).send({message: 'Zmieniono hasło pomyślnie. Teraz możesz się zalogować.'})
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
