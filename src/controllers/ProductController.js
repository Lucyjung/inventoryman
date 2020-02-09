const Product = require('../models/Product')

module.exports = {
    
    create: async(req, res) => {
        if (req.body.data && req.body.id){
            Product.addProduct(req.body.id, req.body.data)
            res.json({success: true})
        } else {
            res.json({success: false})
        }
        
        
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