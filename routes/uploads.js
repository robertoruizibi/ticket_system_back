/*
Ruta base: /api/upload
*/
const { Router } = require('express');
const { enviarArchivo, subirArchivo, deleteFile } = require('../controllers/uploads');
const { validarJWT } = require('../middleware/validar-jwt')
const { check } = require('express-validator')
const { validarCampos, checkUserExists } = require('../middleware/validar-campos')

// Crear router
const router = Router();

// GET
router.get('/:tipo/:fileName', [
  validarJWT,
  check('fileName', 'El identificador no es válido').trim(),
  validarCampos
], enviarArchivo);

// POST
router.post('/:tipo/:id', [
  validarJWT,
  check('id', 'El identificador no es válido').isNumeric(),
  validarCampos
], subirArchivo);

// DELETE
router.delete('/:tipo/:fileName', [
  validarJWT,
  check('fileName', 'El identificador no es válido').trim(),
  validarCampos
], deleteFile);

module.exports = router;