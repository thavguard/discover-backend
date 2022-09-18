require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const sequelize = require('./db/db')
require('./db/index')
const errorMiddleware = require('./middlewares/error-middleware')
const router = require('./routes/index')


const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync({ alter: true })
        console.log('Соединение с БД было успешно установлено')
        app.listen(PORT, () => console.log(`Server has been started on port ${PORT}`))
    } catch (e) {
        console.log('Невозможно выполнить подключение к БД: ', e)
    }
}



const PORT = process.env.PORT || 5050
const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(cors())
app.use('/', router)

app.use(errorMiddleware)

start()


