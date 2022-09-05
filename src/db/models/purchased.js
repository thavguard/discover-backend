const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Purchased = sequelize.define('purchased', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})

const PurchasedItem = sequelize.define('purchased_item', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})

Purchased.hasMany(PurchasedItem)
PurchasedItem.belongsTo(Purchased)

module.exports = { Purchased, PurchasedItem }