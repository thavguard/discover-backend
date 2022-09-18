const Router = require('express')
const tokenMiddleware = require('../middlewares/tokenMiddleware')
const router = new Router()
const soldController = require('../controllers/sold.controller')

router.post('/sold', tokenMiddleware, soldController.addToSold)
router.get('/sold', tokenMiddleware, soldController.getAllSold)
router.get('/sold/:itemId', tokenMiddleware, soldController.getSoldById)
router.delete('/sold', tokenMiddleware, soldController.deleteSold)

module.exports = router