const Rating = require('../db/models/rating')
class RatingService {
    async getRate(rate, userId) {

        const rate = await Rating.findOne({ where: { userId } })

        return rate

    }

    async addRate({ rate, userId, user }) {

        const rate = await Rating.create({ rate, userId, userFrom: user.id })

        return rate
    }
    async deleteRate({ rate, userId, user }) {
        const rate = await Rating.destroy({ where: { userId, userFrom: user.id } })

        return rate
    }
}

module.exports = new RatingService()