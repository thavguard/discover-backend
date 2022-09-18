const { Purchased, PurchasedItem } = require("../db/models/purchased")
const ApiError = require("../exceptions/api-error")

class PurchasedService {
    async addToPurchased(itemId, user) {
        const userPurchased = await Purchased.findOrCreate({ userId: user.id, where: { userId: user.id } })

        const purchasedItem = await PurchasedItem.findOrCreate({ purchasedId: userPurchased[0].id, itemId, where: { purchasedId: userPurchased[0].id, itemId } })
        if (!purchasedItem) {
            throw ApiError.BadRequest('Purchased item не найден')
        }

        if (!purchasedItem[1]) {
            throw ApiError.BadRequest('Purchased item уже в списке')
        }

        return purchasedItem[0]
    }

    async getAllPurchased(user) {
        console.log({ user });
        const userFavs = await Purchased.findOne({ where: { userId: user.id } })

        if (!userFavs) {
            throw ApiError.BadRequest('У пользователя нет товаров в списке проданных')
        }

        const items = await PurchasedItem.findAll({ where: { purchasedId: userFavs.id } })

        return items
    }

    async getPurchasedById(itemId, user) {
        const userFavs = await Purchased.findOne({ where: { userId: user.id } })

        if (!userFavs) {
            throw ApiError.BadRequest('У пользователя нет товаров в списке проданных')
        }

        const fav = await PurchasedItem.findOne({ where: { purchasedId: userFavs.id, itemId } })

        return fav
    }

    async deletePurchased(itemId, user) {
        const userPurchased = await Purchased.findOne({ where: { userId: user.id } })

        const purchasedItem = await PurchasedItem.destroy({ purchasedId: userPurchased.id, itemId, where: { purchasedId: userPurchased.id, itemId } })

        if (!purchasedItem) {
            return ApiError.BadRequest('Purchased item не найден')
        }

        return purchasedItem
    }
}

module.exports = new PurchasedService()