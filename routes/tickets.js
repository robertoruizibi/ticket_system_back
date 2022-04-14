/*
Importacion de modulos
*/
const { Router } = require('express');
const { getTickets, getTicket, createTicket, deleteTicket, updateTicket } = require('../controllers/tickets');
const { check } = require('express-validator')
const { validarCampos, checkTicketExistsPUT, checkTicketExistsDELETE, checkManagerExists, checkClientExists, checkTicketExists } = require('../middleware/validar-campos')
const { validarJWT } = require('../middleware/validar-jwt')

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

// POST
router.post('/', [
  validarJWT,
  check('prioridad', 'El argumento prioridad es obligatorio').not().isEmpty(),
  check('responsable', 'El argumento responsable es obligatorio y numérico').isNumeric(),
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
  check('prioridad', 'El argumento prioridad es obligatorio').not().isEmpty(),
  check('responsable', 'El argumento responsable es obligatorio y numérico').isNumeric(),
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
  check('id', 'El identificador no es válido').isNumeric(),
  validarCampos, 
  checkTicketExistsDELETE
], deleteTicket);

module.exports = router;