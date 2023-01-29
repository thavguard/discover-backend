const db = require('../db/db')
const path = require('path')

const { Item, ItemType, ItemInfo, Characteristic, ItemCharacteristic } = require('../db/models/item')
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error')
const Address = require('../db/models/address')
const ItemService = require('../service/item-service')

class ItemController {
    async addItem(req, res, next) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }

            let { name, description, price, itemTypeId, address, info, tel, wasCreated } = req.body
            const { filename, size } = req.file

            const item = await ItemService.addItem({
                size, address, info, tel, name, description, price, itemTypeId, filename, user: req.user, wasCreated
            })

            return res.json(item)

        } catch (error) {
            return next(error)
        }
    }

    async addItemType(req, res, next) {
        try {
            const { name } = req.body

            const typeId = await ItemService.addItemType({ name })

            return res.json(typeId)

        } catch (error) {
            next(error)
        }
    }

    async getItemTypes(req, res, next) {
        try {
            const { id } = req.query

            const type = await ItemService.getItemTypes({ id })


            return res.json(type)

        } catch (error) {
            next(error)
        }
    }

    async deleteItemType(req, res, next) {
        try {
            const { id } = req.body
            const typeId = await ItemService.deleteItemType({ id })

            return res.json(typeId)

        } catch (error) {
            next(error)
        }
    }

    async editItem(req, res, next) {
        try {
            const { name, description, price, id, rating, tel } = req.body
            const { filename, size } = req.file

            const newItem = await ItemService.editItem({
                id, rating, tel, name, description, price, filename, size
            })


            res.json(newItem)

        } catch (error) {
            next(error)
        }
    }

    l

    async getAllItems(req, res, next) {
        try {
            let { wasCreated, price, name, creator, itemTypeId, limit, page, itemId } = req.query

            limit = limit || 24
            page = page || 1
            let offset = page * limit - limit

            const items = await ItemService.getAllItems({
                wasCreated,
                price,
                name,
                creator,
                itemTypeId,
                limit,
                offset,
                itemId
            })


            return res.json({ items: items.data, total: items.total })


        } catch (error) {
            next(error)
        }

    }

    async getItemById(req, res, next) {
        try {
            const { id } = req.params

            const item = await ItemService.getItemById({ id })

            res.json(item)

        } catch (error) {
            next(error)
        }
    }

    async deleteItem(req, res, next) {
        try {
            const { id } = req.body

            const item = await ItemService.deleteItem({ id })

            return res.json({
                item, message: `Item with id ${id} has been deleted`
            })

        } catch (error) {
            next(error)
        }
    }

    async getImageById(req, res, next) {
        try {
            const { id } = req.params

            await ItemService.getImageById(id, (data) => res.end(data))


        } catch (error) {
            next(error)
        }
    }

    async createItemCharacteristic(req, res, next) {
        try {
            const { title, itemTypeIds, characteristicId, } = req.body

            const data = await ItemService.createItemCharacteristic({ characteristicId, itemTypeIds, title })

            return res.json(data)

        } catch (error) {
            next(error)
        }
    }

    async getItemCharacteristic(req, res, next) {
        try {
            const { itemTypeId, characteristicId } = req.query

            const data = await ItemService.getItemCharacteristic({ characteristicId, itemTypeId })

            return res.json(data)


        } catch (error) {
            next(error)
        }
    }

    async updateItemChar(req, res, next) {
        try {
            const body = req.body

            const data = await ItemService.updateItemChar(body)

            return res.json(data)

        } catch (error) {
            next(error)
        }
    }

    async deleteItemChar(req, res, next) {
        try {
            const { itemTypeId, characteristicId } = req.body

            const itemChar = await ItemService.deleteItemChar({ itemTypeId, characteristicId })

            return res.json(itemChar)

        } catch (error) {
            next(error)
        }

    }


    async detectItem(req, res, next) {
        return res.json('dsds')
    }

}

module.exports = new ItemController()
