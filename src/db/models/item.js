const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Address = require("./address");
const { FavoriteItem } = require("./favorite");
const { PurchasedItem } = require("./purchased");
const Rating = require("./rating");
const { SoldItem } = require("./sold");

const Item = sequelize.define(
    'item',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        price: {
            type: DataTypes.INTEGER
        },
        image: {
            type: DataTypes.STRING
        },
        tel: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
)

const ItemType = sequelize.define('item_type', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
}, {
    timestamps: false
})

const ItemInfo = sequelize.define('item__info', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false }
})

const Characteristic = sequelize.define('characteristic', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true

    }
})

const ItemCharacteristic = sequelize.define('item_characteristic', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }
})

ItemType.hasMany(Item)
Item.belongsTo(ItemType)

Item.hasMany(ItemInfo, { as: 'info' })
ItemInfo.belongsTo(Item)

Item.hasOne(FavoriteItem)
FavoriteItem.belongsTo(Item)

Item.hasOne(PurchasedItem)
PurchasedItem.belongsTo(Item)

Item.hasOne(SoldItem)
SoldItem.belongsTo(Item)

Item.hasOne(Address)
Address.belongsTo(Item)

ItemType.belongsToMany(Characteristic, { through: ItemCharacteristic })
Characteristic.belongsToMany(ItemType, { through: ItemCharacteristic })

module.exports = { Item, ItemType, ItemInfo, Characteristic, ItemCharacteristic }
