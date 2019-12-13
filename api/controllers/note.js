'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Note = require('../models/note');
var User = require('../models/user');


function probando(req,res){
	res.status(200).send({
		message: 'hola desde el controlador de publicaciones'
	});
}

function saveNote(req,res){

	var params = req.body;
	
	if(!params.text) return res.status(200).send({message: 'debes enviar un texto'});

	var note = new Note();
	note.title = params.title;
	note.text = params.text;
	note.file = 'null';
	note.user = req.user.sub;
	note.created_at = moment().unix();

	note.save((err,noteStored)=>{
		if(err) return res.status(200).send({message: 'Error al guardar la nota'});

		if(!noteStored) return res.status(404).send({
			message: 'la nota no ha sido guardada'
		});

		return res.status(200).send({nota: noteStored});	

	});

}

function getNotes(req,res){
	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 4;

	Note.find({ user: req.user.sub }).sort('created_at').populate('user')
		.paginate(page, itemsPerPage, (err, notes, total) => {
			if (err) return res.status(500).send({ message: 'Error devolver notas' });

			if (!notes) return res.status(404).send({ message: 'No hay notas' });

			return res.status(200).send({
				total_items: total,
				pages: Math.ceil(total / itemsPerPage),
				page: page,
				items_Per_Page: itemsPerPage,
				notes
			});
		});
}

function getNote(req,res){
	var noteId = req.params.id;

	Note.findById(noteId, (err, note)=>{
		if(err) return res.status(500).send({message: 'error devolver notas'});

		if(!note) return res.status(404).send({message: 'no existe la nota'});

		return res.status(200).send({note});
	});
}

function deleteNote(req,res){
	var noteId = req.params.id;

	Note.find({'user': req.user.sub, '_id': noteId}).remove(err =>{
		if(err) return res.status(500).send({message: 'error al borrar notas'});

		//if(!noteRemoved) return res.status(404).send({message: 'no se ha borrado la nota'});

		return res.status(200).send({mesage: 'nota eliminada correctamente'});
	});
}

//subir archivos de imagen avatar de usarios
function uploadImage(req,res){
	var noteId = req.params.id;

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];


		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' 
			|| file_ext == 'gif'){

			Note.findOne({'user': req.user.sub, '_id':noteId}).exec((err,note) =>{

				if(note){
					//actualizar documento de publicacion
					Note.findByIdAndUpdate(noteId, {file: file_name}, {new: true}, (err, noteUpdated)=>{
					if(err) return res.status(500).send({message: 'Error en la peticion'});

					if(!noteUpdated) return res.status(404).send({
					message:'No se ha podido actualizar el usuario'});

					return res.status(200).send({note: noteUpdated});
				});
				}else{
					return removeFilesOfUploads(res, file_path, 'No tienes permiso de actualizar esta nota');
				}

			});

		}else{
			return removeFilesOfUploads(res, file_path, 'Extension no valida');
		}
	}else{
		return res.status(200).send({message: 'No se han subido imagenes'});
	}

}

function removeFilesOfUploads(res,file_path, message){
		fs.unlink(file_path, (err)=>{
				return res.status(200).send({message: message});
			});
	}

function getImageFile(req, res){
	var image_file = req.params.imageFile;
	var path_file = './uploads/notes/'+image_file;

	fs.exists(path_file, (exists)=>{
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen ...'});
		}
	});
}	

function updateNote(req,res){
	var noteId =  req.params.id;

	var update = req.body;


		Note.findByIdAndUpdate(noteId, update, {new: true},(err, noteUpdated)=>{
			if(err) return res.status(500).send({message: 'Error en la peticion'});

			if(!noteUpdated) return res.status(404).send({
				message:'No se ha podido actualizar la nota'
			});

				return res.status(200).send({note: noteUpdated});
			});	
		
}



module.exports = {
	probando,
	saveNote,
	getNotes,
	getNote,
	deleteNote,
	updateNote,
	uploadImage,
	getImageFile
}