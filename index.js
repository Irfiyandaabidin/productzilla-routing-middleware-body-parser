const express = require('express');
const app = express();
const router = require('./src/routes/route')
const path = require('path');
const bodyParser = require('body-parser')

const PORT = 3000;
app.listen(3000);

app.use(bodyParser.json())
app.use('/', router)

console.log('App running in port ',PORT)