const Router = require('express')
const router = new Router()
const itemController = require('../controllers/item.controller')
const upload = require('../utils/multer')
const tokenMiddlewarte = require('../middlewares/tokenMiddleware')
const { body } = require('express-validator')



router.post('/item',
    upload.single('image'),
    tokenMiddlewarte,
    body('tel').isMobilePhone('ru-RU'),
    itemController.addItem
)
router.put('/item', tokenMiddlewarte, upload.single('image'), body('tel').isMobilePhone('ru-RU'), itemController.editItem)
router.get('/item', itemController.getAllItems)
router.get('/item/:id', itemController.getItemById)
router.delete('/item', tokenMiddlewarte, itemController.deleteItem)
router.get('/item/:id/img', itemController.getImageById)

router.get('/itemType', itemController.getItemTypes)
router.post('/itemType', tokenMiddlewarte, itemController.addItemType)
router.delete('/itemType', tokenMiddlewarte, itemController.deleteItemType)

router.post('/itemChar', tokenMiddlewarte, itemController.createItemCharacteristic)
router.get('/itemChar', itemController.getItemCharactetistic)
router.put('/itemChar', tokenMiddlewarte, itemController.updateItemChar)
router.delete('/itemChar', tokenMiddlewarte, itemController.deleteItemChar)


module.exports = router