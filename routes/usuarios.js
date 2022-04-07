/*
Importacion de modulos
*/
const { Router } = require('express');
const { getUsuarios, getUsuario, createUsuario, borrarUsuario, actualizarUsuario, actualizarContraseña } = require('../controllers/users');
const bodyParser = require('body-parser');
const { check } = require('express-validator')
const { validarCampos, checkEmailexists, checkUserExists } = require('../middleware/validar-campos')
var jsonParser = bodyParser.json()

// Crear router
const router = Router();

// GET
router.get('/', getUsuarios);
router.get('/:id', getUsuario);

// POST
router.post('/', [
  check('nombre_organizacion', 'El argumento nombre_organizacion es obligatorio').not().isEmpty(),
  check('email', 'El argumento email es obligatorio').not().isEmpty(),
  check('password', 'El argumento password es obligatorio').not().isEmpty(),
  [validarCampos, checkEmailexists],
  ], createUsuario);

// PUT
router.put('/:id', [
  check('nombre_organizacion', 'El argumento nombre_organizacion es obligatorio').not().isEmpty(),
  check('email', 'El argumento email es obligatorio').not().isEmpty(),
  check('password', 'El argumento password es obligatorio').not().isEmpty(),
  check('enabled', 'El argumento enabled es obligatorio').not().isEmpty(),
  check('id_usuario', 'El identificador no es válido').isNumeric(),
  [validarCampos],
  ],actualizarUsuario);
router.put('/change_password/:id', [
  check('password', 'El argumento password es obligatorio').not().isEmpty(),
  check('id_usuario', 'El identificador no es válido').isNumeric(),
  validarCampos
  ], actualizarContraseña);

// DELETE
router.delete('/:id',[
  check('id', 'El identificador no es válido').isNumeric(),
  [validarCampos, checkUserExists]
], borrarUsuario);

module.exports = router;