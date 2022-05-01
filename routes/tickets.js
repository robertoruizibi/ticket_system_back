/*
Importacion de modulos
*/
const { Router } = require('express');
const { getTickets, getTicket, getUserTickets, createTicket, deleteTicket, updateTicket } = require('../controllers/tickets');
const { check } = require('express-validator')
const { validarCampos, checkTicketExistsPUT, checkTicketExistsDELETE, checkManagerExists, checkClientExists, checkTicketExists } = require('../middleware/validar-campos')
const { validarJWT, verifyAdminRol } = require('../middleware/validar-jwt')

// Crear router
const router = Router();

// GET
router.get('/', [
  validarJWT,
  check('desde', 'El desde debe ser un número').optional().isNumeric(),
  check('typeOrder', 'El desde debe ser un número').optional(),
  check('asc', 'El desde debe ser un número').optional(),
], getTickets);
router.get('/:id',[
  validarJWT,
  check('id', 'El identificador no es válido').isNumeric(),
  validarCampos
], getTicket);
router.get('/user/:id', [
  validarJWT,
  check('id', 'El identificador no es válido').isNumeric(),
  check('desde', 'El desde debe ser un número').optional().isNumeric(),
  check('typeOrder', 'El desde debe ser un número').optional(),
  check('asc', 'El desde debe ser un número').optional(),
], getUserTickets);

// POST
router.post('/', [
  validarJWT,
  verifyAdminRol,
  check('prioridad', 'El argumento prioridad es obligatorio').not().isEmpty(),
  check('responsable', 'El argumento responsable es obligatorio y numérico').isNumeric(),
  check('nombre_responsable', 'El argumento nombre_responsable es obligatorio').not().isEmpty(),
  check('cliente', 'El argumento cliente es obligatorio y numérico').isNumeric(),
  check('titulo', 'El argumento titulo es obligatorio').not().isEmpty(),
  check('enabled', 'El argumento enabled es obligatorio').optional().isBoolean(),
  validarCampos, 
  checkManagerExists,
  checkClientExists,
  checkTicketExists
], createTicket);

// PUT
router.put('/:id', [
  validarJWT,
  verifyAdminRol,
  check('prioridad', 'El argumento prioridad es obligatorio').not().isEmpty(),
  check('responsable', 'El argumento responsable es obligatorio y numérico').isNumeric(),
  check('nombre_responsable', 'El argumento nombre_responsable es obligatorio').not().isEmpty(),
  check('cliente', 'El argumento cliente es obligatorio y numérico').isNumeric(),
  check('titulo', 'El argumento titulo es obligatorio').not().isEmpty(),
  check('enabled', 'El argumento enabled es obligatorio').optional().isBoolean(),
  check('id', 'El identificador no es válido').isNumeric(),
  validarCampos, 
  checkManagerExists,
  checkClientExists,
  checkTicketExistsPUT
], updateTicket);


// DELETE
router.delete('/:id',[
  validarJWT,
  verifyAdminRol,
  check('id', 'El identificador no es válido').isNumeric(),
  validarCampos, 
  checkTicketExistsDELETE
], deleteTicket);

module.exports = router;