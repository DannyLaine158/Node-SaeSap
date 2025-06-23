const User = require('../model/user');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
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

// Async: Función asíncrona o en paralelo
controller.enviarContacto = async (req, res) => {
    const { name, email, message } = req.body;

    // Construir el Transportador
    // Looking to send emails in production? Check out our Email API/SMTP product!
    var transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: `${name} - ${email}`,
        to: "daniel@mail.com",
        subject: "Nuevo mensaje de contacto",
        text: `
            Has recibido un nuevo mensaje:
            Nombre: ${name}
            Email: ${email}
            Mensaje: ${message}
        `
    };

    try {
        await transport.sendMail(mailOptions);
        res.redirect('/contacto/enviado');
    } catch (error) {
        console.log("Error al enviar email");
        res.status(500).send("Error al enviar mensaje");
    }
}

controller.contactoEnviado = (req, res) => {
    const pagina = fs.readFileSync(path.join(__dirname, '../views/pages/contacto_exitoso.ejs'), 'utf8');
    res.render('layouts/layout', { 
        'titulo': 'Mensaje Enviado',
        body: pagina
    });
}

controller.verPerfil = async (req, res) => {
    // Obtener un parámetro desde la URL
    const id = req.params.id;
    const usuario = User.obtenerUsuarioPorId(id);
    // console.log(usuario);

    if (!usuario)
        return res.redirect('/error');

    const pagina = await ejs.renderFile("views/pages/perfil.ejs", { 
        usuario
    });

    res.render('layouts/layout', { 
        'titulo': 'Perfil de ' + usuario.nombre,
        body: pagina
    });
}

controller.error_404 = (req, res) => {
    const pagina = fs.readFileSync(path.join(__dirname, '../views/pages/error_404.ejs'), 'utf8');
    res.render('layouts/layout', { 
        'titulo': 'Error 404',
        body: pagina
    });
}

controller.editarUsuario = async (req, res) => {
    const id = req.params.id;
    const usuario = User.obtenerUsuarioPorId(id);

    if (!usuario)
        return res.redirect('/error');

    const pagina = await ejs.renderFile("views/pages/editar.ejs", { 
        usuario
    });

    res.render('layouts/layout', { 
        'titulo': 'Editar ' + usuario.nombre,
        body: pagina
    });
}

controller.actualizarUsuario = (req, res) => {
    const id = req.params.id;
    const { name, email } = req.body;
    const usuario = User.obtenerUsuarioPorId(id);
    if (!usuario) return res.status(404).send("Usuario no encontrado");

    const foto = req.file ? `/images/${req.file.filename}` : usuario.foto;

    User.actualizarUsuario(id, {
        "nombre": name,
        "email": email,
        foto
    });

    res.redirect(`/usuarios/${id}?updated=true`);
}

controller.eliminarUsuario = (req, res) => {
    // console.log("Hola");
    const eliminado = User.eliminarUsuario(req.params.id);

    if (!eliminado) {
        return res.status(404).render('layouts/layout', {
            titulo: "Usuario no encontrado",
            body: `
                <div class='notification is-danger is-light'>
                    No se encontró dicho usuario
                </div>
            `
        });
    }

    res.redirect('/?updated=true');
}

controller.mostrarFormularioNuevo = (req, res) => {
    const pagina = fs.readFileSync(path.join(__dirname, '../views/pages/nuevo.ejs'), 'utf8');
    res.render('layouts/layout', {
        titulo: 'Nuevo usuario',
        body: pagina
    });
}

controller.crearUsuario = (req, res) => {
    const { nombre, correo } = req.body;

    if (!nombre || !correo)
        return res.status(400).send("Faltan campos obligatorios");

    const foto = req.file ? `/images/${req.file.filename}` : '/images/default.jpg';
    const nuevoId = User.crearUsuario({
        nombre,
        correo,
        foto
    });

    res.redirect(`/usuarios/${nuevoId}?updated=true`);
}

module.exports = controller;