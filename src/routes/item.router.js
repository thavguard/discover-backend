const Router = require('express')
const router = new Router()
const itemController = require('../controllers/item.controller')
const upload = require('../utils/multer')
const tokenMiddlewarte = require('../middlewares/tokenMiddleware')



router.post('/item', [tokenMiddlewarte, upload.single('image')], itemController.addItem)
router.put('/item', [tokenMiddlewarte, upload.single('image')], itemController.editItem)
router.get('/item', itemController.getAllItems)
router.get('/item/:id', itemController.getItemById)
router.delete('/item', [tokenMiddlewarte], itemController.deleteItem)
router.get('/item/:id/img', itemController.getImageById)


module.exports = router