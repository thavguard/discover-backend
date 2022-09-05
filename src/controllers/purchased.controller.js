const { Favorite, FavoriteItem } = require("../db/models/favorite")
const ApiError = require("../exceptions/api-error")
const favoriteService = require("../service/favorite-service")


class PurchasedController {
    async addToPurchased(req, res, next) {
        try {
            const { itemId } = req.body

            const fav = await favoriteService.addToFav(itemId, req.user)

            return res.json(fav)
        } catch (error) {
            next(error)
        }
    }


    async getAllPurchased(req, res, next) {
        try {
            const userFavs = await Favorite.findOne({ where: { userId: req.user.id } })

            if (!userFavs) {
                return res.json({ message: 'У пользователя нет товаров в избранном' })
            }

            const favs = await FavoriteItem.findAll({ where: { favoriteId: userFavs.id } })


            return res.json(favs)
        } catch (error) {
            next(error)
        }
    }

    async getPurchasedById(req, res, next) {
        try {
            const { itemId } = req.params
            const userFavs = await Favorite.findOne({ where: { userId: req.user.id } })

            if (!userFavs) {
                return res.json({ message: 'У пользователя нет товаров в избранном' })
            }

            const favs = await FavoriteItem.findOne({ where: { favoriteId: userFavs.id, itemId } })


            return res.json(favs)
        } catch (error) {
            next(error)
        }
    }

    async deletePurchased(req, res, next) {
        try {
            const { itemId } = req.body

            const userFavorites = await Favorite.findOrCreate({ userId: req.user.id, where: { userId: req.user.id } })

            const favoriteItem = await FavoriteItem.destroy({ favoriteId: userFavorites[0].id, itemId, where: { favoriteId: userFavorites[0].id, itemId } })

            if (!favoriteItem) {
                return next(ApiError.BadRequest('Item не найден'))
            }

            return res.json({ message: `Item with id ${itemId} has been removed from favorites` })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new PurchasedController()