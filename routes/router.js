const express = require('express');
const router = express.Router(); // Clase estática Router de Express
const controller = require('../controller/controller');

router.get('/', controller.mostrarInicio);
router.get('/contacto', controller.mostarContacto);
router.post('/contacto', controller.enviarContacto);
router.get('/contacto/enviado', controller.contactoEnviado);
router.get('/usuarios/:id', controller.verPerfil);
router.get('/error', controller.error_404);
router.get('/usuarios/:id/editar', controller.editarUsuario);
router.post('/usuarios/:id/editar', controller.actualizarUsuario);

module.exports = router;