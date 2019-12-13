'use strict'

var express = require('express');
var NoteController = require('../controllers/note');
var api = express.Router();

var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/notes'});

api.get('/probando-pub', md_auth.ensureAuth, NoteController.probando);
api.post('/note', md_auth.ensureAuth, NoteController.saveNote);
api.get('/notes/:page?', md_auth.ensureAuth, NoteController.getNotes);
api.get('/note/:id', md_auth.ensureAuth, NoteController.getNote);
api.delete('/note/:id', md_auth.ensureAuth, NoteController.deleteNote);
api.put('/update-note/:id',md_auth.ensureAuth, NoteController.updateNote);
api.post('/upload-image-note/:id', [md_auth.ensureAuth, md_upload], NoteController.uploadImage);
api.get('/get-image-note/:imageFile', NoteController.getImageFile);

module.exports = api;