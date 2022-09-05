const Router = require('express')
const tokenMiddleware = require('../middlewares/tokenMiddleware')
const router = new Router()
const purchasedController = require('../controllers/purchased.controller')

router.post('/purchased', tokenMiddleware, purchasedController.addToPurchased)
router.get('/purchased', tokenMiddleware, purchasedController.getAllPurchased)
router.get('/purchased/:itemId', tokenMiddleware, purchasedController.getPurchasedById)
router.delete('/purchased', tokenMiddleware, purchasedController.deletePurchased)

module.exports = router