/*
Importacion de modulos
*/
const { Router } = require('express');
const { login, token } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');

// Crear router
const router = Router();

// POST
router.post('/', [
  check('x-auth', 'El argumento x-auth es obligatorio').not().isEmpty(),
  validarCampos,
], token);

// POST
router.post('/login', [
  check('password', 'El argumento pasword es obligatorio').not().isEmpty(),
  check('email', 'El argumento email es obligatorio').not().isEmpty(),
  validarCampos,
], login);


module.exports = router;