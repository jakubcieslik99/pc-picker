import dotenv from 'dotenv'

dotenv.config()

const config = {
    PORT: process.env.PORT || 5000,
    IP: process.env.IP || '127.0.0.1',
    MYSQL_HOST: process.env.MYSQL_HOST || '127.0.0.1',
    MYSQL_USER: process.env.MYSQL_USER || 'root',
    MYSQL_DATABASE: process.env.MYSQL_DATABASE || 'programowanie-aplikacji-biznesowych',
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || '',
    API_URL: process.env.API_URL || 'http://localhost:5000',
    APP_URL: process.env.APP_URL || 'http://localhost:3000',
    JWT_SECRET: process.env.JWT_SECRET || 'JWT_SECRET',
    NOREPLY_ADDRESS: process.env.NOREPLY_ADDRESS || 'noreply@pc-picker.com',
    GMAIL_ADDRESS: process.env.GMAIL_ADDRESS || '',
    GMAIL_PASS: process.env.GMAIL_PASS || ''
}

export default config
