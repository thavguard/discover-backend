const { Sold, SoldItem } = require("../db/models/sold")
const ApiError = require("../exceptions/api-error")

class SoldService {
    async addToSold(itemId, user) {
        const userSolds = await Sold.findOrCreate({ userId: user.id, where: { userId: user.id } })

        const soldItem = await SoldItem.findOrCreate({ soldId: userSolds[0].id, itemId, where: { soldId: userSolds[0].id, itemId } })
        if (!soldItem) {
            throw ApiError.BadRequest('Sold item не найден')
        }

        if (!soldItem[1]) {
            throw ApiError.BadRequest('Sold item уже в списке')
        }

        return soldItem[0]
    }

    async getAllSold(user) {
        console.log({ user });
        const userSolds = await Sold.findOne({ where: { userId: user.id } })

        if (!userSolds) {
            throw ApiError.BadRequest('У пользователя нет товаров в списке купленных')
        }

        const items = await SoldItem.findAll({ where: { soldId: userSolds.id } })

        return items
    }

    async getSoldById(itemId, user) {
        const userSolds = await Sold.findOne({ where: { userId: user.id } })

        if (!userSolds) {
            throw ApiError.BadRequest('У пользователя нет товаров в списке купленных')
        }

        const fav = await SoldItem.findOne({ where: { soldId: userSolds.id, itemId } })

        return fav
    }

    async deleteSold(itemId, user) {
        const userSolds = await Sold.findOne({ where: { userId: user.id } })

        const soldItem = await SoldItem.destroy({ soldId: userSolds.id, itemId, where: { soldId: userSolds.id, itemId } })

        if (!soldItem) {
            return ApiError.BadRequest('Sold item не найден')
        }

        return soldItem
    }
}

module.exports = new SoldService()