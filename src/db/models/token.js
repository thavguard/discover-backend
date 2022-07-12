const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./user");

const Token = sequelize.define('token', {
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

User.hasOne(Token)
Token.belongsTo(User)

module.exports = Token