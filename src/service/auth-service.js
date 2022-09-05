const User = require('../db/models/user')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user.dto')
const ApiError = require('../exceptions/api-error')

class AuthService {
    async registration(email, password, username) {
        const candidateEmail = await User.findOne({ where: { email } })
        const candidateUsername = await User.findOne({ where: { username } })


        if (candidateEmail || candidateUsername) {
            throw ApiError.BadRequest('Пользователь с таким username / email уже существует')
        }

        const hashPassword = await bcrypt.hash(password, 3)
        const activatedLink = uuid.v4()

        const user = await User.create({ email, password: hashPassword, username, activatedLink })
        await mailService.sendActivationEmail(email, `${process.env.API_URL}/auth/activate/${activatedLink}`)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens, user: userDto
        }
    }



    async activate(activatedLink) {
        const user = await User.findOne({ where: { activatedLink } })
        if (!user) {
            throw ApiError.BadRequest('Некорректная ссылка активации')
        }
        await User.update({ isActivated: true }, {
            where: {
                activatedLink
            }
        })
    }

    async login(email, password) {
        const user = await User.findOne({ where: { email } })
        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль')
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens, user: userDto
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }

        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }
        const user = await User.findOne({ where: { id: userData.id } })
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens, user: userDto
        }
    }
}

module.exports = new AuthService()