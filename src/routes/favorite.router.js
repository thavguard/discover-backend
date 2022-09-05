const Router = require('express')
const tokenMiddleware = require('../middlewares/tokenMiddleware')
const router = new Router()
const favoriteController = require('../controllers/favorite.controller')

router.post('/fav', tokenMiddleware, favoriteController.addToFav)
router.get('/fav', tokenMiddleware, favoriteController.getAllFavs)
router.get('/fav/:itemId', tokenMiddleware, favoriteController.getFavById)
router.delete('/fav', tokenMiddleware, favoriteController.removeFavs)

module.exports = router