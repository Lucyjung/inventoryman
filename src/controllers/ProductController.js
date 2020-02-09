const Product = require('../models/Product')

module.exports = {
    
    create: async(req, res) => {
        Product.addProduct('test1', {amount: 50})
        res.json({success: true})
    },
    read: async(req, res) => {
        const prodList = await Product.listProduct()
        res.json({success: true, result: prodList})
    },
    update: async(req, res) => {
        res.json({success: true})
    },

    delete: async(req, res) => {
        res.json({success: true})
    },
}