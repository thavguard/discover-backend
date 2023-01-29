const Router = require('express')
const tokenMiddleware = require('../middlewares/tokenMiddleware')
const router = new Router()
const favoriteController = require('../controllers/favorite.controller')

router.post('/fav', tokenMiddleware, favoriteController.addToFav)
router.get('/fav', tokenMiddleware, favoriteController.getAllFavs)
router.get('/fav/:itemId', tokenMiddleware, favoriteController.getFavById)
router.get('/fav_items', tokenMiddleware, favoriteController.getFavoriteItems)
router.delete('/fav', tokenMiddleware, favoriteController.removeFavs)

module.exports = router
