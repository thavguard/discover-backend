const ApiError = require("../exceptions/api-error")
const soldService = require("../service/sold-service")


class SoldController {
    async addToSold(req, res, next) {
        try {
            const { itemId } = req.body

            const fav = await soldService.addToSold(itemId, req.user)

            return res.json(fav)
        } catch (error) {
            next(error)
        }
    }


    async getAllSold(req, res, next) {
        try {

            const favs = await soldService.getAllSold(req.user)

            return res.json(favs)
        } catch (error) {
            next(error)
        }
    }

    async getSoldById(req, res, next) {
        try {
            const { itemId } = req.params

            const fav = await soldService.getSoldById(itemId, req.user)

            return res.json(fav)
        } catch (error) {
            next(error)
        }
    }

    async deleteSold(req, res, next) {
        try {
            const { itemId } = req.body

            const fav = soldService.deleteSold(itemId, req.user)

            return res.json(fav)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new SoldController()