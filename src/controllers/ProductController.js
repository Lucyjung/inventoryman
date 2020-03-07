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
        const prodList = await Product.listProduct()

        res.json({success: true, result: prodList})
        
    },
    update: async(req, res) => {
        res.json({success: true})
    },

    delete: async(req, res) => {
        res.json({success: true})
    },
    sync: async (req, res) => {
        
        let limit = 50
        let total = limit; 
        let offset = 0;
        const products = []
        try {
            do {
                let instance = await lazada.init()
                let request = lazada.initRequest("/products/get","GET")
                request = lazada.addApiParam(request, "filter", "all")
                request = lazada.addApiParam(request, "limit", String(limit))
                request = lazada.addApiParam(request, "offset", String(offset))
                const response = await lazada.execute(instance, request, "")
                const resData = response.data
                if (resData.data) {
                    
                    total = resData.data.total_products
                    let count = resData.data.products.length
                    for (let prod of resData.data.products)
                    {
                        products.push({
                            lazadaId : prod.item_id,
                            quantity: prod.skus[0].quantity,
                            name: prod.attributes.name,
                            description: prod.attributes.short_description,
                        })
                    }            
                    offset += count
                } else {
                    break;
                }
            }
            while (offset < total); 

            for (let prod of products){
                Product.addProduct(prod.lazadaId, prod);
            }
            
            res.json({success: true, result: products })
        }catch (e){
            
            res.json({success: false, message: e.name + ': ' + e.message })
        }
        
    },
    generatetoken: async (req, res) => {
        try {
            const data = await lazada.createToken(req.body.code)
            res.json({success: true, result: data})
        }
        catch (e){
            console.log(e)
            res.json({success: false, msg: e})
        }
    },
    refreshToken: async (req, res) => {
        try {
            const data = await lazada.refreshToken();
            res.json({success: true})
        } catch (e){
            console.log(e)
            res.json({success: false, msg: e})
        }
    }
}