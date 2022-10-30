const Rating = require('../db/models/rating')

class RatingService {
    async getRate(rate, userId) {

        const data = await Rating.findOne({ where: { userId } })

        return data

    }

    async addRate({ rate, userId, user }) {

        const data = await Rating.create({ rate, userId, userFrom: user.id })

        return data
    }

    async deleteRate({ rate, userId, user }) {
        const data = await Rating.destroy({ where: { userId, userFrom: user.id } })

        return data
    }
}

module.exports = new RatingService()
