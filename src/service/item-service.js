const ApiError = require("../exceptions/api-error");
const { Item, ItemInfo, ItemType, Characteristic, ItemCharacteristic } = require("../db/models/item");
const Address = require("../db/models/address");
const path = require("path");
const fs = require("fs");

class ItemService {

    async addItem({ size, name, description, price, filename, itemTypeId, user, tel, address, info }) {
        if (size > 1.5e7) {
            throw ApiError.BadRequest('Слишком большой размер файла. Максимальный - 15мб')
        }

        const item = await Item.create({
            name, description, price, image: filename, itemTypeId, userId: user.id, tel
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
        const typeId = await ItemType.create({ name })

        return typeId
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
        const typeId = await ItemType.destroy({ where: { id } })

        return typeId
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

        const newItem = await Item.findOne({ where: { id } })

        return newItem
    }

    async getAllItems({ itemTypeId, limit }) {
        let items

        if (itemTypeId) {
            items = await Item.findAll({
                where: { itemTypeId }, include: { model: Address, as: 'address' }, limit,
            })
        } else {
            items = await Item.findAll({
                include: { model: Address, as: 'address' }, limit
            })
        }

        return items

    }

    async getItemById({ id }) {
        const item = await Item.findOne({
            where: { id }, include: [{ model: ItemInfo, as: 'info' }, { model: Address, as: 'address' }]
        })

        return item
    }

    async deleteItem({ id }) {
        const item = await Item.destroy({
            where: {
                id
            }
        })

        return item
    }

    async getImageById(id, onRead) {
        const item = await Item.findOne({ where: { id } })
        const imagePath = path.resolve(__dirname, '../../uploads', item.image)

        fs.readFile(imagePath, (err, data) => {
            onRead(data)
            return data

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

            const characteristics = await Characteristic.findAll({
                where: {
                    id: charIds.map(item => item.characteristicId),
                }
            })

            return characteristics
        }

        if (characteristicId) {
            const itemTypeIds = await ItemCharacteristic.findAll({
                where: {
                    characteristicId
                }
            })

            return itemTypeIds
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

        throw ApiError.BadRequest('Что то пошло не так')
    }

    async deleteItemChar({ characteristicId, itemTypeId }) {
        const itemChar = await ItemCharacteristic.destroy({
            where: {
                itemTypeId, characteristicId
            }
        })

        return itemChar
    }


}

module.exports = new ItemService()

