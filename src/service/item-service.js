const ApiError = require("../exceptions/api-error");
const { Item, ItemInfo, ItemType, Characteristic, ItemCharacteristic } = require("../db/models/item");
const Address = require("../db/models/address");
const path = require("path");
const fs = require("fs");
const sharp = require('sharp')
const { User } = require("../db");
const { Op } = require("sequelize");
const sequelize = require('sequelize')


class ItemService {

    async addItem({ size, name, description, price, filename, itemTypeId, user, tel, address, info, wasCreated }) {
        if (size > 1.5e7) {
            throw ApiError.BadRequest('Слишком большой размер файла. Максимальный - 15мб')
        }

        const item = await Item.create({
            name, description, price, image: filename, itemTypeId, userId: user.id, tel, wasCreated
        })

        let addressObj = JSON.parse(address)
        await Address.create({ itemId: item.id, ...addressObj })

        if (info) {
            console.log(info);
            info = JSON.parse(info)
            console.log(info);
            info.forEach(i => ItemInfo.create({
                title: i.title, description: i.description, itemId: item.id
            }))
        }

        return item
    }

    async addItemType({ name }) {
        return await ItemType.create({ name })
    }

    async getItemTypes({ id }) {
        let type

        if (id) {
            type = await ItemType.findOne({ where: { id } })
        } else {
            type = await ItemType.findAll()
        }

        return type
    }

    async deleteItemType({ id }) {
        return await ItemType.destroy({ where: { id } })
    }

    async editItem({ size, name, description, price, filename, rating, tel, id }) {
        if (size > 1.5e7) {
            throw ApiError.BadRequest('Слишком большой размер файла. Максимальный - 15мб')
        }

        const item = await Item.update({ name, description, price, image: filename, rating, tel }, {
            where: {
                id
            }
        })

        return await Item.findOne({ where: { id } })

    }

    async getAllItems({
                          wasCreated, price, name, creator, itemTypeId, limit, offset
                      }) {
        let items = {
            data: [], length: 0,
        }

        items.data = await Item.findAll()

        console.log({ price, name, creator, itemTypeId, wasCreated })

        if (wasCreated) {
            items.data = items.data.filter(item => +item.wasCreated >= +wasCreated - 80827943)
        }

        if (price[0]) {
            items.data = items.data.filter(item => item.price >= +price[0])
        }

        if (price[1]) {
            items.data = items.data.filter(item => item.price <= +price[1])
        }

        if (name) {
            items.data = items.data.filter(item => item.name.toLowerCase().trim().includes(name.toLowerCase().trim())) // TODO: Протестить метод trim()
        }

        if (itemTypeId) {
            items.data = items.data.filter(item => item.itemTypeId === +itemTypeId)
        }


        items.length = (await Item.findAll()).length
        items.length = Math.round(items.length)


        return items

    }

    async getItemById({ id }) {
        return await Item.findOne({
            where: { id }, include: [{ model: ItemInfo, as: 'info' }, { model: Address, as: 'address' }]
        })
    }

    async deleteItem({ id }) {
        return await Item.destroy({
            where: {
                id
            }
        })
    }

    async getImageById(id, onRead) {
        const item = await Item.findOne({ where: { id } })
        const imagePath = path.resolve(__dirname, '../../uploads', item.image)

        fs.readFile(imagePath, async (err, data) => {
            const compressedData = await sharp(data)
                .webp({
                    quality: 25, chromaSubsampling: '4:4:4',
                })
                .toBuffer();
            return onRead(compressedData)

        });
    }

    async createItemCharacteristic({ title, itemTypeIds, characteristicId }) {

        if (title && itemTypeIds) {
            const characteristic = await Characteristic.create({ title })

            itemTypeIds.forEach(async (itemTypeId) => await ItemCharacteristic.create({
                itemTypeId, characteristicId: characteristic.id
            }))

            return { title: characteristic.title, itemTypeIds: ItemCharacteristic }
        }

        if (characteristicId && itemTypeIds) {
            itemTypeIds.forEach(async (itemTypeId) => await ItemCharacteristic.create({
                itemTypeId, characteristicId
            }))

            return itemTypeIds
        }
    }

    async getItemCharacteristic({ itemTypeId, characteristicId }) {
        if (itemTypeId && characteristicId) {
            throw ApiError.BadRequest('эндпоинт прнимает только один агрумент за раз')
        }

        if (itemTypeId) {
            const charIds = await ItemCharacteristic.findAll({
                where: { itemTypeId },
            })

            return await Characteristic.findAll({
                where: {
                    id: charIds.map(item => item.characteristicId),
                }
            })
        }

        if (characteristicId) {
            return await ItemCharacteristic.findAll({
                where: {
                    characteristicId
                }
            })
        }


        return await ItemCharacteristic.findAll()
    }

    async updateItemChar({ currentItemTypeId, currentCharacteristicId, newItemTypeId, newCharacteristicId }) {

        if (newItemTypeId && newCharacteristicId) {
            throw ApiError.BadRequest('Необходимо посылать тольк один из аргументов `newItemTypeId` или `newCharacteristicId`')
        }

        if (newItemTypeId) {
            await ItemCharacteristic.update({
                itemTypeId: newItemTypeId,
            }, {
                where: {
                    itemTypeId: currentItemTypeId, characteristicId: currentCharacteristicId,
                }
            })

            return true
        }

        if (newCharacteristicId) {
            await ItemCharacteristic.update({
                characteristicId: newCharacteristicId,
            }, {
                where: {
                    itemTypeId: currentItemTypeId, characteristicId: currentCharacteristicId,
                }
            })

            return true
        }

        throw ApiError.BadRequest('Что-то пошло не так')
    }

    async deleteItemChar({ characteristicId, itemTypeId }) {
        return await ItemCharacteristic.destroy({
            where: {
                itemTypeId, characteristicId
            }
        })
    }
}

module.exports = new ItemService()
