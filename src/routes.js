const routes = require('express').Router();
const ProductController = require('./controllers/ProductController');
const MainController = require('./controllers/MainController');

routes.get('/callback', MainController.callback);
routes.post('/callback', MainController.postcallback);

routes.post('/product', ProductController.create);
routes.patch('/product', ProductController.update);
routes.get('/product', ProductController.read);
routes.delete('/product', ProductController.delete);
routes.post('/product/sync', ProductController.sync);

routes.post('/token', ProductController.generatetoken);
routes.post('/refresh', ProductController.refreshToken);

module.exports = routes;