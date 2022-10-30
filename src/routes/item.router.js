const Router = require('express')
const router = new Router()
const itemController = require('../controllers/item.controller')
const upload = require('../utils/multer')
const tokenMiddleware = require('../middlewares/tokenMiddleware')
const { body } = require('express-validator')



router.post('/item',
    upload.single('image'),
    tokenMiddleware,
    body('tel').isMobilePhone('ru-RU'),
    itemController.addItem
)
router.put('/item', tokenMiddleware, upload.single('image'), body('tel').isMobilePhone('ru-RU'), itemController.editItem)
router.get('/item', itemController.getAllItems)
router.get('/item/:id', itemController.getItemById)
router.delete('/item', tokenMiddleware, itemController.deleteItem)
router.get('/item/:id/img', itemController.getImageById)

router.get('/itemType', itemController.getItemTypes)
router.post('/itemType', tokenMiddleware, itemController.addItemType)
router.delete('/itemType', tokenMiddleware, itemController.deleteItemType)

router.post('/itemChar', tokenMiddleware, itemController.createItemCharacteristic)
router.get('/itemChar', itemController.getItemCharacteristic)
router.put('/itemChar', tokenMiddleware, itemController.updateItemChar)
router.delete('/itemChar', tokenMiddleware, itemController.deleteItemChar)


module.exports = router
