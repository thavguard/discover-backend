const jwt = require('jsonwebtoken')
const secret = require('../config')
const ApiError = require('../exceptions/api-error')
const tokenService = require('../service/token-service')

module.exports = (req, res, next) => {
    try {
        const authorizatinHeader = req.headers.authorization
        if (!authorizatinHeader) {
            return next(ApiError.UnauthorizedError())
        }
        const accessToken = authorizatinHeader.split(' ')[1]

        if (!accessToken) {
            return next(ApiError.UnauthorizedError())
        }

        const userData = tokenService.validateAccessToken(accessToken)

        if (!userData) {
            return next(ApiError.UnauthorizedError())
        }

        req.user = userData
        next()
    } catch (error) {
        return next(ApiError.UnauthorizedError())
    }
}