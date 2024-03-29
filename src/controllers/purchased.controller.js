const ApiError = require("../exceptions/api-error")
const purchasedService = require("../service/purchased-service")


class PurchasedController {
    async addToPurchased(req, res, next) {
        try {
            const { itemId } = req.body

            const fav = await purchasedService.addToPurchased(itemId, req.user)

            return res.json(fav)
        } catch (error) {
            next(error)
        }
    }


    async getAllPurchased(req, res, next) {
        try {

            const favs = await purchasedService.getAllPurchased(req.user)

            return res.json(favs)
        } catch (error) {
            next(error)
        }
    }

    async getPurchasedById(req, res, next) {
        try {
            const { itemId } = req.params

            const fav = await purchasedService.getPurchasedById(itemId, req.user)

            return res.json(fav)
        } catch (error) {
            next(error)
        }
    }

    async deletePurchased(req, res, next) {
        try {
            const { itemId } = req.body

            const fav = purchasedService.deletePurchased(itemId, req.user)

            return res.json(fav)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new PurchasedController()