const express = require('express');
const app = express()
const routes = require('./src/routes');
const port = process.env.PORT || 3001;
const bodyParser = require('body-parser');
const morgan = require('morgan')
const urlencodedParser = bodyParser.urlencoded({
    extended: false
});
const {Storage} = require('@google-cloud/storage');
const projectId = 'lucy-251517'
const keyFilename = './Lucy-cb44211de2be.json'
const storage = new Storage({projectId, keyFilename});

app.use(bodyParser.json());
app.use(urlencodedParser);
app.use(morgan('combined'))

app.use('/', routes);
app.use(express.static('public'));


app.listen(port, () => console.log(`Application listening on port ${port}!`))