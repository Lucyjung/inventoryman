
module.exports = {
    
    callback: async(req, res) => {
        console.log(req.query)
        res.json({success: true})
    },
    postcallback: async(req, res) => {
        console.log(req.body)
        res.json({success: true})
    }
}