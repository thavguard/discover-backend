const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Favorite = sequelize.define('favorite', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})

const FavoriteItem = sequelize.define('favorite_item', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})

Favorite.hasMany(FavoriteItem)
FavoriteItem.belongsTo(Favorite)

module.exports = {
    Favorite, FavoriteItem
}