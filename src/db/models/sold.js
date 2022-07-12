const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Sold = sequelize.define('favorite', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})

const SoldItem = sequelize.define('favorite_item', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})

Sold.hasMany(SoldItem)
SoldItem.belongsTo(Sold)

module.exports = { Sold, SoldItem }