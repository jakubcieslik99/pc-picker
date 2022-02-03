import mysql from 'mysql2'
import config from './environmentVariables'

const databasePool = mysql.createPool({
    host: config.MYSQL_HOST,
    user: config.MYSQL_USER,
    database: config.MYSQL_DATABASE,
    password: config.MYSQL_PASSWORD
})

export default databasePool.promise()
