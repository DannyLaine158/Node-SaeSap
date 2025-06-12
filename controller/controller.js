const User = require('../model/user');
const path = require('path');
const controller = {};

controller.mostrarInicio = (req, res) => {
    const usuarios = User.obtenerUsuarios();
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
    // res.send("Hola desde Inicio");
}

controller.mostarContacto = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/contacto.html'));
    // res.send("Contacto");
}

module.exports = controller;