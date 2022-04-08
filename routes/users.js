/*
Importacion de modulos
*/
const { Router } = require('express');
const { getUsuarios, getUsuario, createUsuario, borrarUsuario, actualizarUsuario, actualizarContraseña } = require('../controllers/users');
const bodyParser = require('body-parser');
const { check } = require('express-validator')
const { validarCampos, checkEmailexists, checkEmailExistsPUT, checkUserExists } = require('../middleware/validar-campos')
const { validarJWT } = require('../middleware/validar-jwt')

// Crear router
const router = Router();

// GET
router.get('/', validarJWT, getUsuarios);
router.get('/:id', getUsuario);

// POST
router.post('/', [
  check('nombre_organizacion', 'El argumento nombre_organizacion es obligatorio').not().isEmpty(),
  check('email', 'El argumento email es obligatorio').not().isEmpty(),
  check('password', 'El argumento password es obligatorio').not().isEmpty(),
  [validarJWT, validarCampos, checkEmailexists],
], createUsuario);

// PUT
router.put('/:id', [
  check('nombre_organizacion', 'El argumento nombre_organizacion es obligatorio').not().isEmpty(),
  check('email', 'El argumento email es obligatorio').not().isEmpty(),
  // check('password', 'El argumento password es obligatorio').not().isEmpty(),
  check('enabled', 'El argumento enabled es obligatorio').not().isEmpty(),
  check('id', 'El identificador no es válido').isNumeric(),
  [validarJWT, validarCampos, checkUserExists, checkEmailExistsPUT],
],actualizarUsuario);

router.put('/change_password/:id', [
  check('password', 'El argumento password es obligatorio').not().isEmpty(),
  check('id', 'El identificador no es válido').isNumeric(),
  [validarJWT, validarCampos, checkUserExists]
], actualizarContraseña);

// DELETE
router.delete('/:id',[
  check('id', 'El identificador no es válido').isNumeric(),
  [validarJWT, validarCampos, checkUserExists]
], borrarUsuario);

module.exports = router;