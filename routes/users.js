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
router.get('/', [
  validarJWT,
  check('desde', 'El desde debe ser un número').optional().isNumeric(),
  check('typeOrder', 'El desde debe ser un número').optional(),
  check('asc', 'El desde debe ser un número').optional(),
], getUsuarios);

router.get('/:id',[
  validarJWT,
  check('id', 'El identificador no es válido').isNumeric(),
  validarCampos
], getUsuario);

// POST
router.post('/', [
  validarJWT,
  check('nombre_organizacion', 'El argumento nombre_organizacion es obligatorio').not().isEmpty(),
  check('email', 'El argumento email es obligatorio').not().isEmpty(),
  check('password', 'El argumento password es obligatorio').not().isEmpty(),
  check('image', 'El argumento image es obligatorio').optional().isEmpty(),
  validarCampos, 
  checkEmailexists
], createUsuario);

// PUT
router.put('/:id', [
  validarJWT,
  check('nombre_organizacion', 'El argumento nombre_organizacion es obligatorio').not().isEmpty(),
  check('email', 'El argumento email es obligatorio').not().isEmpty(),
  check('enabled', 'El argumento enabled es obligatorio').not().isEmpty(),
  check('id', 'El identificador no es válido').isNumeric(),
  validarCampos,
  checkUserExists,
  checkEmailExistsPUT
],actualizarUsuario);

router.put('/change_password/:id', [
  validarJWT,
  check('password', 'El argumento password es obligatorio').not().isEmpty(),
  check('id', 'El identificador no es válido').isNumeric(),
  validarCampos, 
  checkUserExists
], actualizarContraseña);

// DELETE
router.delete('/:id',[
  validarJWT,
  check('id', 'El identificador no es válido').isNumeric(),
  validarCampos, 
  checkUserExists
], borrarUsuario);

module.exports = router;