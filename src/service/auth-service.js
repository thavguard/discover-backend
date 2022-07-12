const User = require('../db/models/user')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user.dto')

class AuthService {
    async registration(email, password, username) {
        const candidateEmail = await User.findOne({ where: { email } })
        const candidateUsername = await User.findOne({ where: { username } })


        if (candidateEmail || candidateUsername) {
            throw new Error('Пользователь с таким username / email уже существует')
        }

        const hashPassword = await bcrypt.hash(password, 3)
        const activatedLink = uuid.v4()

        const user = await User.create({ email, password: hashPassword, username, activatedLink })
        await mailService.sendActivationEmail(email, activatedLink)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens, user: userDto
        }
    }
}

module.exports = new AuthService()