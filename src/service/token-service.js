const jwt = require('jsonwebtoken')
const TokenModel = require('../db/models/token')

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        console.log("SAVE TOKEN USER ID", userId);
        const tokenData = await TokenModel.findOne({ where: { userId } })

        if (tokenData) {
            tokenData.refreshToken = refreshToken
            // TokenModel.update({ refreshToken })
            return tokenData.save()
        }

        const token = await TokenModel.create({ userId, refreshToken })
        return token
    }
}

module.exports = new TokenService()