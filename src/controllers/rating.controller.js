const ratingService = require("../service/rating-service")


class RatingController {
    async getRate(req, res, next) {
        const { rate, userId } = req.body

        const rating = ratingService.getRate(rate, userId)

        return res.json(rating)

    }

    async addRate(req, res, next) {
        const { rate, userId } = req.body

        const rating = ratingService.addRate({ rate, userId, user: req.user })

        return res.json(rating)

    }
    async deleteRate(req, res, next) {
        const { rate, userId } = req.body

        const rating = ratingService.deleteRate({ rate, userId, user: req.user })

        return res.json(rating)
    }
}

module.exports = new RatingController()