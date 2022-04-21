/*
Importacion de modulos
*/
const { Router } = require('express');
const { getUsuarios, getUsuario, createUsuario, borrarUsuario, actualizarUsuario, actualizarContrasena } = require('../controllers/users');
const { check } = require('express-validator')
const { validarCampos, checkEmailexists, checkEmailExistsPUT, checkUserExists } = require('../middleware/validar-campos')
const { validarJWT, verifyAdminRol } = require('../middleware/validar-jwt')

// Crear router
const router = Router();

// GET
router.get('/', [
  validarJWT,
  verifyAdminRol,
  check('desde', 'El desde debe ser un número').optional().isNumeric(),
  check('typeOrder', 'El desde debe ser un número').optional(),
  check('asc', 'El desde debe ser un número').optional(),
], getUsuarios);

router.get('/:id',[
  validarJWT,
  verifyAdminRol,
  check('id', 'El identificador no es válido').isNumeric(),
  validarCampos
], getUsuario);

// POST
router.post('/', [
  validarJWT,
  verifyAdminRol,
  check('nombre_organizacion', 'El argumento nombre_organizacion es obligatorio').not().isEmpty(),
  check('email', 'El argumento email es obligatorio').not().isEmpty(),
  check('password', 'El argumento password es obligatorio').not().isEmpty(),
  validarCampos, 
  checkEmailexists
], createUsuario);

// PUT
router.put('/:id', [
  validarJWT,
  verifyAdminRol,
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
], actualizarContrasena);

// DELETE
router.delete('/:id',[
  validarJWT,
  verifyAdminRol,
  check('id', 'El identificador no es válido').isNumeric(),
  validarCampos, 
  checkUserExists
], borrarUsuario);

module.exports = router;