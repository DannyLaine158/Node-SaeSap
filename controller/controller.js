const User = require('../model/user');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const controller = {};

controller.mostrarInicio = async (req, res) => {
    // const pagina = fs.readFileSync(path.join(__dirname, '../views/pages/index.ejs'), 'utf8')
    const usuarios = User.obtenerUsuarios();
    // res.sendFile(path.join(__dirname, '../public/html/index.html'));
    const pagina = await ejs.renderFile("views/pages/index.ejs", { 
        usuarios
    });

    res.render('layouts/layout', {
        titulo: 'Inicio',
        body: pagina
    });
}

controller.mostarContacto = (req, res) => {
    // res.sendFile(path.join(__dirname, '../public/html/contacto.html'));
    // res.send("Contacto");
    const pagina = fs.readFileSync(path.join(__dirname, '../views/pages/contacto.ejs'), 'utf8');
    res.render('layouts/layout', { 
        'titulo': 'Contacto',
        body: pagina
    });
}

module.exports = controller;