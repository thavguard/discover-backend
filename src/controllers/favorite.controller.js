const { Favorite, FavoriteItem } = require("../db/models/favorite")
const ApiError = require("../exceptions/api-error")
const favoriteService = require("../service/favorite-service")


class FavoriteController {
    async addToFav(req, res, next) {
        try {
            const { itemId } = req.body

            const fav = await favoriteService.addToFav(itemId, req.user)

            return res.json(fav)
        } catch (error) {
            next(error)
        }
    }


    async getAllFavs(req, res, next) {
        try {

            const favs = await favoriteService.getAllFavs(req.user)

            return res.json(favs)
        } catch (error) {
            next(error)
        }
    }

    async getFavById(req, res, next) {
        try {
            const { itemId } = req.params

            const fav = await favoriteService.getFavById(itemId, req.user)

            return res.json(fav)
        } catch (error) {
            next(error)
        }
    }

    async removeFavs(req, res, next) {
        try {
            const { itemId } = req.body

            const fav = favoriteService.removeFavs(itemId, req.user)

            return res.json(fav)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new FavoriteController()