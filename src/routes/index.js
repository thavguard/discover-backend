const Router = require('express')
const router = new Router()
const itemRouter = require('./item.router')
const authRouter = require('./auth.router')
const userRouter = require('./user.router')
const favoriteRouter = require('./favorite.router')
const purchasedRouter = require('./purchased.router')
const soldRouter = require('./sold.router')

router.use('/api', itemRouter)
router.use('/api', userRouter)
router.use('/api', favoriteRouter)
router.use('/api', purchasedRouter)
router.use('/api', soldRouter)
router.use('/auth', authRouter)

module.exports = router