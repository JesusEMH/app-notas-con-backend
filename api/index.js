'use strict'
var mongoose = require('mongoose');
var app = require('./app');

var port = 3700;
 
mongoose.Promise = global.Promise;

//conexion database
mongoose.connect('mongodb://localhost:27017/note-app', {useMongoClient: true})
	.then(() => {
		console.log('npte-app conectado correctamente');

		//crear servidor
		app.listen(port, () => {
			console.log("Servidor corriendo en http://localhost:3700");
		});
	})
	.catch(err => console.log(err)
		);

