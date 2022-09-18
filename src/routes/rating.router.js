const Router = require('express')
const ratingController = require('../controllers/rating.controller')
const router = new Router()
const tokenMiddleware = require('../middlewares/tokenMiddleware')


router.get('/rating', ratingController.getRate)
router.post('/rating', tokenMiddleware, ratingController.addRate)
router.delete('/rating', tokenMiddleware, ratingController.deleteRate)

