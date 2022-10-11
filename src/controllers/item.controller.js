const db = require('../db/db')
const path = require('path')
const fs = require('fs')
const { Item, ItemType, ItemInfo } = require('../db/models/item')

class ItemController {
    async addItem(req, res, next) {
        try {
            let { name, description, price, itemTypeId, address, info } = req.body
            const { filename, size } = req.file

            if (size > 1.5e7) {
                return next(ApiError.BadRequest('Слишком большой размер файла. Максимальный - 15мб'))
            }


            const item = await Item.create({ name, description, price, image: filename, itemTypeId, address })

            if (info) {
                console.log(info);
                info = JSON.parse(info)
                console.log(info);
                info.forEach(i =>
                    ItemInfo.create({
                        title: i.title,
                        description: i.description,
                        itemId: item.id
                    })
                )
            }


            return res.json(item)

        } catch ({ message }) {
            res.statusCode = 500
            res.json({
                error: message
            })
        }
    }

    async addItemType(req, res, next) {
        try {
            const { name } = req.body
            const typeId = await ItemType.create({ name })

            return res.json(typeId)

        } catch (error) {
            next(error)
        }
    }

    async getItemTypes(req, res, next) {
        try {
            const { id } = req.query

            console.log(id);

            let type

            if (id) {
                type = await ItemType.findOne({ where: { id } })
            }

            if (!id) {
                type = await ItemType.findAll()
            }


            return res.json(type)

        } catch (error) {
            next(error)
        }
    }

    async deleteItemType(req, res, next) {
        try {
            const { id } = req.body
            const typeId = await ItemType.destroy({ where: { id } })

            return res.json(typeId)

        } catch (error) {
            next(error)
        }
    }

    async editItem(req, res) {
        try {
            const { name, description, price, id, rating } = req.body
            const { filename, size } = req.file

            if (size > 1.5e7) {
                return next(ApiError.BadRequest('Слишком большой размер файла. Максимальный - 15мб'))
            }

            const item = await Item.update({ name, description, price, image: filename, rating }, {
                where: {
                    id: id
                }
            })

            const newItem = await Item.findOne({ where: { id } })

            res.json(newItem)

        } catch ({ message }) {
            res.statusCode = 500
            res.json({
                error: message
            })
        }
    }

    async getAllItems(req, res) {
        try {
            const { itemTypeId } = req.query
            let items

            console.log(itemTypeId);

            if (itemTypeId) {
                items = await Item.findAll({ where: { itemTypeId } })
            }

            if (!itemTypeId) {
                items = await Item.findAll()

            }


            return res.json(items)



        } catch ({ message }) {
            res.statusCode = 500
            res.json({
                error: message
            })
        }

    }

    async getItemById(req, res) {
        try {

            const { id } = req.params
            const item = await Item.findOne({ where: { id }, include: { model: ItemInfo, as: 'info' } })
            console.log(item);
            res.json(item)

        } catch ({ message }) {
            res.statusCode = 500
            res.json({
                error: message
            })
        }
    }

    async deleteItem(req, res) {
        try {

            const { id } = req.body
            const item = await Item.destroy({
                where: {
                    id
                }
            })
            res.json({
                item,
                message: `Item with id ${id} has been deleted`
            })

        } catch ({ message }) {
            res.statusCode = 500
            res.json({
                error: message
            })
        }
    }

    async getImageById(req, res) {
        try {
            const { id } = req.params
            const item = await Item.findOne({ where: { id } })

            const imagePath = path.resolve(__dirname, '../../uploads', item.image)

            fs.readFile(imagePath, (err, data) => {
                res.end(data);
            });

        } catch ({ message }) {
            res.status(400).json({ message })
        }
    }
}

module.exports = new ItemController()