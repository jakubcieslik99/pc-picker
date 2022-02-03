import createError from 'http-errors'

const isValidId = (x, y=null, z=null) => {
    return (req, res, next) => {
        if(x!==null) if(parseInt(x)<0) throw createError(422, 'Przesłano błędne dane.')
        if(y!==null) if(parseInt(x)<0) throw createError(422, 'Przesłano błędne dane.')
        if(z!==null) if(parseInt(x)<0) throw createError(422, 'Przesłano błędne dane.')
        
        return next()
    }
}

export {isValidId}
