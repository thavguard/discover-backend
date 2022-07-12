const jwt = require('jsonwebtoken')
const secret = require('../config')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next()
    }

    const token = req.headers.authorization
    if (!token) {
        res.status(403).json({ message: 'Пользователь не авторизован' })
    }

    req.token = jwt.verify(token, secret)

    next()
}