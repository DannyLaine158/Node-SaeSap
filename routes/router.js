const express = require('express');
const router = express.Router(); // Clase estática Router de Express
const controller = require('../controller/controller');

router.get('/', controller.mostrarInicio);
router.get('/contacto', controller.mostarContacto);

module.exports = router;