const User = require("../db/models/user")
const ApiError = require('../exceptions/api-error')
const UserDto = require("../dtos/user.dto");

class UserController {
    async editUser(req, res, next) {
        try {
            const { email, password, username, } = req.body
            const { filename } = req.file

            const user = await User.update({ email, password, username, avatar: filename }, { where: { id: 1 } })

            return res.json(user)

        } catch (error) {
            next(error)
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await User.findAll()
            console.log(users);
            return res.json(users)
        } catch (error) {
            next(error)
        }
    }

    async getUserById(req, res, next) {
        try {
            const { id } = req.params

            const user = await User.findOne({
                where: {
                    id
                }
            })

            if (!user) {
                next(ApiError.NotFound(`User with id ${id} doesn't exist`))
            }

            const userDto = new UserDto(user)

            return res.json(userDto)
        } catch (e) {
            next(e)
        }
    }

    async getUserUsername(req, res, next) {
        try {
            const { username } = req.query

            const user = await User.findOne({
                where: {
                    username
                }
            })

            if (!user) {
                next(ApiError.NotFound(`User with username ${username} doesn't exist`))
            }

            const userDto = new UserDto(user)

            return res.json(userDto)

        } catch (error) {
            next(error)
        }
    }

    async deleteUser(req, res, next) {
        try {
            const { userId } = req.body

            const deleteUser = await User.destroy({ where: { id: userId } })

            return res.json(deleteUser)

        } catch (error) {
            next(error)
        }
    }
}

module.exports = new UserController()
