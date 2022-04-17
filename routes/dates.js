/*
Importacion de modulos
*/
const { Router } = require('express');
const { getDates, getDate, createDate, updateDate, deleteDate } = require('../controllers/dates');
const { check } = require('express-validator')
const { validarCampos, checkDatesExistsPUT, checkDatesExists, checkDateDontExist, checkDateDontExistDELETE } = require('../middleware/validar-campos')
const { validarJWT, verifyAdminRol } = require('../middleware/validar-jwt')

// Crear router
const router = Router();

// GET
router.get('/', [
  validarJWT,
  check('desde', 'El desde debe ser un número').optional().isNumeric(),
], getDates);
router.get('/:id',[
  validarJWT,
  check('id', 'El identificador no es válido').isNumeric(),
  validarCampos
], getDate);

// POST
router.post('/', [
  validarJWT,
  verifyAdminRol,
  check('fecha_creacion', 'El argumento fecha_creacion es obligatorio').not().isEmpty(),
  check('fecha_actualizacion', 'El argumento fecha_actualizacion es obligatorio').not().isEmpty(),
  check('ultima_fecha_consulta_cliente', 'El argumento ultima_fecha_consulta_cliente es obligatorio').optional(),
  check('id_ticket', 'El argumento id_ticket es obligatorio').isNumeric(),
  validarCampos,
  checkDatesExists
], createDate);

// PUT
router.put('/:id', [
  validarJWT,
  verifyAdminRol,
  check('fecha_creacion', 'El argumento fecha_creacion es obligatorio').optional(),
  check('fecha_actualizacion', 'El argumento fecha_actualizacion es obligatorio').optional(),
  check('ultima_fecha_consulta_cliente', 'El argumento ultima_fecha_consulta_cliente es obligatorio').optional(),
  check('id_ticket', 'El argumento id_ticket es obligatorio').optional().isNumeric(),
  check('id', 'El identificador no es válido').isNumeric(),
  validarCampos,
  checkDateDontExist,
  checkDateDontExistDELETE,
  checkDatesExistsPUT
],updateDate);

// DELETE
router.delete('/:id',[
  validarJWT,
  verifyAdminRol,
  check('id', 'El identificador no es válido').isNumeric(),
  validarCampos,
  checkDateDontExistDELETE
], deleteDate);

module.exports = router;