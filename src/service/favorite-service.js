const { Favorite, FavoriteItem } = require("../db/models/favorite")
const ApiError = require("../exceptions/api-error")
const { Item } = require("../db");

class FavoriteService {
    async addToFav(itemId, user) {
        const userFavorites = await Favorite.findOrCreate({ userId: user.id, where: { userId: user.id } })

        const favoriteItem = await FavoriteItem.findOrCreate({
            favoriteId: userFavorites[0].id, itemId, where: { favoriteId: userFavorites[0].id, itemId }
        })
        if (!favoriteItem) {
            throw ApiError.BadRequest('Item не найден')
        }

        if (!favoriteItem[1]) {
            throw ApiError.BadRequest('Item уже в избранном')
        }

        return favoriteItem[0]
    }

    async getAllFavs(user) {
        console.log({ user });
        const userFavs = await Favorite.findOne({ where: { userId: user.id } })

        if (!userFavs) {
            throw ApiError.BadRequest('У пользователя нет товаров в избранном')
        }

        const favs = await FavoriteItem.findAll({ where: { favoriteId: userFavs.id } })

        return favs
    }

    async getFavoriteItems(user) {
        const userFavs = await Favorite.findOne({ where: { userId: user.id } })

        if (!userFavs) {
            throw ApiError.BadRequest('У пользователя нет товаров в избранном')
        }

        const favs = await FavoriteItem.findAll({ where: { favoriteId: userFavs.id } })

        const items = await Item.findAll({
            where: {
                id: favs.map(item => item.itemId)
            }
        })

        return items


    }

    async getFavById(itemId, user) {
        const userFavs = await Favorite.findOne({ where: { userId: user.id } })

        if (!userFavs) {
            throw ApiError.BadRequest('У пользователя нет товаров в избранном')
        }

        const fav = await FavoriteItem.findOne({ where: { favoriteId: userFavs.id, itemId } })

        return fav
    }

    async removeFavs(itemId, user) {
        const userFavorites = await Favorite.findOne({ where: { userId: user.id } })

        const favoriteItem = await FavoriteItem.destroy({
            favoriteId: userFavorites.id, itemId, where: { favoriteId: userFavorites.id, itemId }
        })

        if (!favoriteItem) {
            return ApiError.BadRequest('Item не найден')
        }

        return favoriteItem
    }
}

module.exports = new FavoriteService()
