const Router = require('express')
const router = new Router()
const authController = require('../controllers/auth.controller')
const { body } = require('express-validator')
const upload = require('../utils/multer')


router.post('/registration',
    upload.single('avatar'),
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    body('username').isLength({ min: 3, max: 25 }),
    authController.registration
)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.get('/activate/:link', authController.activate)
router.get('/refresh', authController.refresh)


module.exports = router
