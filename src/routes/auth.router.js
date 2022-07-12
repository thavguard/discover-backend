const Router = require('express')
const router = new Router()
const authController = require('../controllers/auth.controller')
const { check } = require('express-validator')

router.post('/registration', [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть больше 4 и меньше 20 символов').isLength({ min: 4, max: 20 })
], authController.registration)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.get('/activate/:link', authController.activate)
router.get('/refresh', authController.refresh)


module.exports = router
