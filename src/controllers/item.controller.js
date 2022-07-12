const db = require('../db/db')
const path = require('path')
const fs = require('fs')
const { Item } = require('../db/models/item')


class ItemController {
    async addItem(req, res, next) {
        try {
            const { name, description, price, } = req.body
            const { filename, size } = req.file

            const item = await Item.create({ name, description, price, image: filename })

            return res.json(item)

        } catch ({ message }) {
            res.statusCode = 500
            res.json({
                error: message
            })
        }
    }

    async editItem(req, res) {
        try {
            const { name, description, price, id, rating } = req.body
            const { filename, size } = req.file
            const item = await Item.update({ name, description, price, image: filename, rating }, {
                where: {
                    id: id
                }
            })

            const newItem = await Item.findOne({ where: { id } })

            res.json(newItem)

        } catch ({ message }) {
            res.statusCode = 500
            res.json({
                error: message
            })
        }
    }

    async getAllItems(req, res) {
        try {

            const item = await Item.findAll()
            console.log(item);
            res.json(item)
        } catch ({ message }) {
            res.statusCode = 500
            res.json({
                error: message
            })
        }

    }

    async getItemById(req, res) {
        try {

            const { id } = req.params
            const item = await Item.findOne({ where: { id } })
            console.log(item);
            res.json(item)

        } catch ({ message }) {
            res.statusCode = 500
            res.json({
                error: message
            })
        }
    }

    async deleteItem(req, res) {
        try {

            const { id } = req.body
            const item = await Item.destroy({
                where: {
                    id
                }
            })
            res.json({
                item,
                message: `Item with id ${id} has been deleted`
            })

        } catch ({ message }) {
            res.statusCode = 500
            res.json({
                error: message
            })
        }
    }

    async getImageById(req, res) {
        try {
            const { id } = req.params
            // const item = await db.query(`SELECT * FROM item WHERE id = $1`, [id])
            const item = await Item.findOne({ where: { id } })

            const imagePath = path.resolve(__dirname, '../../uploads', item.image)

            fs.readFile(imagePath, (err, data) => {
                res.end(data);
            });

        } catch ({ message }) {
            res.status(400).json({ message })
        }
    }
}

module.exports = new ItemController()