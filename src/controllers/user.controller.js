const User = require("../db/models/user")

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