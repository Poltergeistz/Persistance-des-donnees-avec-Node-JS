// Modules
let express = require('express');
let mongodb = require('mongodb');
let ejs = require('ejs');

// Set express
let app = express();
app.set('view engine', 'ejs');

// Routes
app.get('/', function (req,res){
    res.send('test');
})

// Listen
app.listen(8080, function (req,res){
    console.log('Server Online')
})
