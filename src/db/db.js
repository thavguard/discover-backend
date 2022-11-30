const { Sequelize } = require('sequelize')

const user = process.env.USER
const host = process.env.HOST
const database = process.env.DATABASE
const password = process.env.PASSWORD
const port = process.env.DB_PORT

const sequelize = process.env.deploy === 'dev' ? new Sequelize(database, user, password, {
    host,
    port,
    dialect: 'postgres',
    logging: false
}) : new Sequelize(process.env.pg_URI)

module.exports = sequelize









