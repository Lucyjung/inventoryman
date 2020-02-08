const routes = require('express').Router();
const ProductController = require('./controllers/ProductController');

routes.post('/product', ProductController.create);
routes.patch('/product', ProductController.update);
routes.get('/product', ProductController.read);
routes.delete('/product', ProductController.delete);


module.exports = routes;