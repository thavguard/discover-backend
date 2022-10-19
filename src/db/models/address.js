const sequelize = require("../db");
const { DataTypes } = require('sequelize')

const Address = sequelize.define(
    'address'
    , {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        region: {
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        street: {
            type: DataTypes.STRING,
            allowNull: false
        },
        house: {
            type: DataTypes.STRING
        },
        area: {
            type: DataTypes.STRING
        }
    })



module.exports = Address