'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});

//cargar rutas
var user_routes = require('./routes/user');
var note_routes = require('./routes/note');


//middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



//rutas
app.use('/api', user_routes);
app.use('/api', note_routes);


//exportar la configuracion
 module.exports = app;

