/*
Importacion de modulos
*/
const { Router } = require('express');
const { getReports, getReport, createReport, deleteReport, updateReport } = require('../controllers/reports');
const { check } = require('express-validator')
const { validarCampos, checkReportExistsPUT, checkReportTicketExists } = require('../middleware/validar-campos')
const { validarJWT } = require('../middleware/validar-jwt')

// Crear router
const router = Router();

// GET
// router.get('/', [
//   validarJWT,
//   check('desde', 'El desde debe ser un número').optional().isNumeric(),
// ], getReports);
router.get('/:id',[
  validarJWT,
  check('id', 'El identificador no es válido').isNumeric(),
  check('desde', 'El desde debe ser un número').optional().isNumeric(),
  validarCampos
], getReports);

router.get('/report/:id',[
  validarJWT,
  check('id', 'El identificador no es válido').isNumeric(),
  validarCampos
], getReport);

// POST
router.post('/', [
  validarJWT,
  check('contenido', 'El argumento contenido es obligatorio').not().isEmpty(),
  check('fecha_creacion', 'El argumento fecha_creacion es obligatorio').not().isEmpty(),
  check('archivo_adjunto', 'El argumento archivo_adjunto es obligatorio').optional(),
  check('visto', 'El argumento visto es obligatorio').not().isEmpty(),
  check('id_ticket', 'El argumento id_ticket es obligatorio').not().isEmpty().isNumeric(),
  validarCampos
], createReport);

// // PUT
router.put('/:id', [
  validarJWT,
  check('contenido', 'El argumento contenido es obligatorio').not().isEmpty(),
  check('fecha_creacion', 'El argumento fecha_creacion es obligatorio').not().isEmpty(),
  check('archivo_adjunto', 'El argumento archivo_adjunto es obligatorio').optional(),
  check('visto', 'El argumento visto es obligatorio').not().isEmpty(),
  check('id_ticket', 'El argumento id_ticket es obligatorio').not().isEmpty().isNumeric(),
  check('id', 'El identificador no es válido').isNumeric(),
  validarCampos,
  checkReportExistsPUT,
  checkReportTicketExists
],updateReport);

// // DELETE
router.delete('/:id',[
  validarJWT,
  check('id', 'El identificador no es válido').isNumeric(),
  validarCampos, 
  checkReportExistsPUT
], deleteReport);

module.exports = router;