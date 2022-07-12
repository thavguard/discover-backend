const Router = require('express')
const userController = require('../controllers/user.controller')
const router = new Router()


router.put('/user', userController.editUser)
router.get('/users', userController.getUsers)


module.exports = router