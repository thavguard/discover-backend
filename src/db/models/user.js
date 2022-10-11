const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const { Favorite } = require("./favorite");
const { Purchased } = require("./purchased");
const Rating = require("./rating");
const { Sold } = require("./sold");

const User = sequelize.define(
    'user',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isActivated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        activatedLink: {
            type: DataTypes.STRING
        },
        username: {
            unique: true,
            type: DataTypes.STRING,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'USER'
        },
    }
)

const UserRating = sequelize.define('user_rating', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userFrom: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
})

User.hasOne(Favorite)
Favorite.belongsTo(User)

User.hasOne(Purchased)
Purchased.belongsTo(User)

User.hasOne(Sold)
Sold.belongsTo(User)

User.belongsToMany(Rating, { through: UserRating })
Rating.belongsToMany(User, { through: UserRating })

module.exports = User
