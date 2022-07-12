const db = require('../db/db')
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');
const User = require('../db/models/user')
const authService = require('../service/auth-service')

const generateAccessToken = (user) => {
    const payload = {
        user
    }

    return jwt.sign(payload, secret, { expiresIn: '24h' })
}

class AuthController {
    async registration(req, res) {
        try {
            const { email, password, username } = req.body
            const userData = await authService.registration(email, password, username)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)

        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: `Registration error: ${e}` })
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body
            const user = User.findOne({ where: { username } })
            if (!user) {
                return res.status(400).json({ message: 'Пользователя с таким именем не существует' })
            }

            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({ message: 'Неверный пароль' })

            }

            const token = generateAccessToken(user)

            return res.json({ username, token })

        } catch ({ message }) {
            console.log(message);
            return res.status(400).json({ message: `Login error: ${message}` })
        }
    }

    async logout(req, res) {

    }

    async activate(req, res) {

    }

    async refresh(req, res) {

    }
}

module.exports = new AuthController()