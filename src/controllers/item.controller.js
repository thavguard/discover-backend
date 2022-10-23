const db = require('../db/db')
const path = require('path')
const fs = require('fs')
const { Item, ItemType, ItemInfo, Characteristic, ItemCharacteristic } = require('../db/models/item')
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error')
const Address = require('../db/models/address')

class ItemController {
    async addItem(req, res, next) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }

            let { name, description, price, itemTypeId, address, info, tel } = req.body
            const { filename, size } = req.file

            if (size > 1.5e7) {
                return next(ApiError.BadRequest('Слишком большой размер файла. Максимальный - 15мб'))
            }


            const item = await Item.create({
                name, description, price, image: filename, itemTypeId, userId: req.user.id, tel
            })

            address = JSON.parse(address)
            Address.create({ itemId: item.id, ...address })

            if (info) {
                console.log(info);
                info = JSON.parse(info)
                console.log(info);
                info.forEach(i => ItemInfo.create({
                    title: i.title, description: i.description, itemId: item.id
                }))
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
            const { name, description, price, id, rating, tel } = req.body
            const { filename, size } = req.file

            if (size > 1.5e7) {
                return next(ApiError.BadRequest('Слишком большой размер файла. Максимальный - 15мб'))
            }

            const item = await Item.update({ name, description, price, image: filename, rating, tel }, {
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
            let { itemTypeId, limit } = req.query
            limit = limit || 24

            let items

            console.log(itemTypeId);

            if (itemTypeId) {
                items = await Item.findAll({ where: { itemTypeId }, include: { model: Address, as: 'address' }, limit })
            }

            if (!itemTypeId) {
                items = await Item.findAll({ include: { model: Address, as: 'address' }, limit })

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
            const item = await Item.findOne({
                where: { id }, include: [{ model: ItemInfo, as: 'info' }, { model: Address, as: 'address' }]
            })
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
                item, message: `Item with id ${id} has been deleted`
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

    async createItemCharacteristic(req, res, next) {
        try {
            const { title, itemTypeIds, characteristicId, } = req.body

            if (title && itemTypeIds) {
                const characteristic = await Characteristic.create({ title })

                itemTypeIds.forEach(async (itemTypeId) => await ItemCharacteristic.create({
                    itemTypeId, characteristicId: characteristic.id
                }))

                return res.json({ title: characteristic.title, itemTypeIds: ItemCharacteristic })
            }

            if (characteristicId && itemTypeIds) {
                itemTypeIds.forEach(async (itemTypeId) => await ItemCharacteristic.create({
                    itemTypeId, characteristicId
                }))

                return res.json(itemTypeIds)
            }


        } catch (error) {
            return next(ApiError.BadRequest(error.message, error))
        }
    }

    async getItemCharactetistic(req, res, next) {
        try {
            const { itemTypeId, characteristicId } = req.query

            console.log(itemTypeId)

            if (itemTypeId && characteristicId) {
                return next(ApiError.BadRequest('эндпоинт прнимает только один агрумент за раз'))
            }

            if (itemTypeId) {
                const charIds = await ItemCharacteristic.findAll({
                    where: { itemTypeId },
                })

                const characteristics = await Characteristic.findAll({
                    where: {
                        id: charIds.map(item => item.characteristicId),
                    }
                })

                return res.json(characteristics)
            }

            if (characteristicId) {
                const itemTypeIds = await ItemCharacteristic.findAll({
                    where: {
                        characteristicId
                    }
                })

                return res.json(itemTypeIds)
            }


            return res.json(await ItemCharacteristic.findAll())

        } catch (error) {
            return next(ApiError.BadRequest(error.message, error))
        }
    }

    async updateItemChar(req, res, next) {
        try {
            const { currentItemTypeId, currentCharacteristicId, newItemTypeId, newCharacteristicId } = req.body

            if (newItemTypeId && newCharacteristicId) {
                return next(ApiError.BadRequest('Необходимо посылать тольк один из аргументов `newItemTypeId` или `newCharacteristicId`'))
            }

            if (newItemTypeId) {
                await ItemCharacteristic.update({
                    itemTypeId: newItemTypeId,
                }, {
                    where: {
                        itemTypeId: currentItemTypeId, characteristicId: currentCharacteristicId,
                    }
                })

                return res.json(true)
            }

            if (newCharacteristicId) {
                await ItemCharacteristic.update({
                    characteristicId: newCharacteristicId,
                }, {
                    where: {
                        itemTypeId: currentItemTypeId, characteristicId: currentCharacteristicId,
                    }
                })

                return res.json(true)
            }

        } catch (error) {
            return next(ApiError.BadRequest(error.message, error))
        }
    }

    async deleteItemChar(req, res, next) {
        const { itemTypeId, characteristicId } = req.body

        const itemChar = await ItemCharacteristic.destroy({
            where: {
                itemTypeId, characteristicId
            }
        })

        return res.json(itemChar)
    }
}

module.exports = new ItemController()
