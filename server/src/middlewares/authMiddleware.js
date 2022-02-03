import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import config from '../config/environmentVariables'
import databasePool from '../config/databaseConnect'

const getToken = user => {
    return new Promise((resolve, reject) => {
        jwt.sign({
            id: user.id,
            isAdmin: user.isAdmin
        }, config.JWT_SECRET, {
            expiresIn: '14d'
        }, (error, token) => {
            if(error) {
                console.log(error.message)
                return reject(createError(500, 'Błąd serwera.'))
            }
            return resolve(token)
        }) 
    })
}

const isAuth = (req, res, next) => {
    if(!req.headers.authorization) return next(createError(401, 'Błąd autoryzacji.'))
    const bearerToken = req.headers.authorization
    const token = bearerToken.slice(7, bearerToken.length)
    
    jwt.verify(token, config.JWT_SECRET, async (error, decode) => {
        if(error) return next(createError(401, 'Błąd autoryzacji.'))
        req.user = decode
        req.user.id = parseInt(req.user.id)

        const [checkedUser, _] = await databasePool.execute(`SELECT * FROM users WHERE id=${req.user.id} LIMIT 1;`)
        if(checkedUser.length<=0) return next(createError(404, 'Konto użytkownika nie istnieje lub zostało usunięte.'))
        req.checkedUser = checkedUser[0]

        return next()
    })
}

const isAdmin = (req, res, next) => {
    if(!req.user) return next(createError(401, 'Błąd autoryzacji.'))
    if(!req.checkedUser) return next(createError(404, 'Konto użytkownika nie istnieje lub zostało usunięte.'))
    if(!req.checkedUser.isAdmin) return next(createError(403, 'Brak wystarczających uprawnień.'))

    return next()
}

export {getToken, isAuth, isAdmin}
