const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./user");

const Token = sequelize.define('token', {
    refreshToken: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
})

User.hasOne(Token)
Token.belongsTo(User)

module.exports = Token