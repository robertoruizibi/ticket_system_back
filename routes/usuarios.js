/*
Importación de módulos
*/
const { Router } = require('express');
const { getUsuarios, createUsuario, borrarUsuario, actualizarUsuario, actualizarContraseña } = require('../controllers/users');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json()

// Crear router
const router = Router();

// GET
router.get('/', getUsuarios);

// POST
router.post('/', jsonParser, createUsuario);

// PUT
router.put('/:id', jsonParser, actualizarUsuario);
router.put('/change_password/:id', jsonParser, actualizarContraseña);

// DELETE
router.delete('/:id', borrarUsuario);

module.exports = router;