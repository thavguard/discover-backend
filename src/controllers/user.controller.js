const User = require("../db/models/user")

class UserController {
    async editUser(req, res) {
        try {
            const { email, password, username, } = req.body
            const { filename } = req.file

            const user = await User.update({ email, password, username, avatar: filename }, { where: { id: 1 } })

            return res.json(user)



        } catch ({ message }) {
            return res.status(400).json({ message })
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.findAll()
            console.log(users);
            return res.json(users)
        } catch ({ message }) {
            return res.status(400).json({ message })
        }
    }
}

module.exports = new UserController()