/*
Ruta base: /api/upload
*/
const { Router } = require('express');
const { enviarArchivo, subirArchivo } = require('../controllers/uploads');
const { validarJWT } = require('../middleware/validar-jwt')

// Crear router
const router = Router();

// GET
router.get('/:tipo/:id', validarJWT, enviarArchivo);

// POST
router.post('/:tipo/:id', validarJWT, subirArchivo);

module.exports = router;