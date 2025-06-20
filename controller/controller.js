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
    const usuarios = User.obtenerUsuarios();

    // Obtenemos al indice del usuario que estamos buscando
    const index = usuarios.findIndex(u => u.id === parseInt(id));

    if (index === -1) return res.status(404).send("Usario no encontrado");

    let usuario = usuarios[index];
    const { name, email } = req.body;
    const foto = req.file ? `/images/${req.file.filename}` : usuario.foto;

    // console.log(foto);

    // Agregamos los datos al usuario
    usuarios[index] = { ...usuario, 
        "nombre": name, 
        "correo": email,
        "foto": foto
    };

    fs.writeFileSync(path.join(__dirname, '../database/users.json'), 
        JSON.stringify(usuarios, null, 2));

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

module.exports = controller;