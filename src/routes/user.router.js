const Router = require('express')
const router = new Router()
const userController = require('../controllers/user.controller')
const tokenMiddleware = require('../middlewares/tokenMiddleware')


router.put('/user', userController.editUser)
router.get('/users', tokenMiddleware, userController.getUsers)
router.get('/user/:id', userController.getUserById)
router.get('/user', userController.getUserUsername)
router.post('/deleteUser', userController.deleteUser)


module.exports = router
