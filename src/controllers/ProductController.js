const Product = require('../models/Product')
const lazada = require('../services/lazada')
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
        //const prodList = await Product.listProduct()
        const instance = await lazada.init()
        let request = lazada.initRequest("/products/get","GET")
        request = lazada.addApiParam(request, "filter", "all")

        lazada.execute(instance, request, "").then((response) => {
            const data = response.data
            res.json({success: true, result: data})
        })
        
    },
    update: async(req, res) => {
        res.json({success: true})
    },

    delete: async(req, res) => {
        res.json({success: true})
    },
}