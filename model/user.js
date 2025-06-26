const fs = require('fs');
const path = require('path');
const route = path.join(__dirname, '../database/users.json');
const db = require('../config/db');

const User = {
    obtenerUsuarios: (callback) => {
        db.query('SELECT * FROM usuarios', (err, results) => {
            if (err) return callback(err);
            const usuarios = results.map(user => ({
                ...user
            }));
            // console.log(usuarios);
            
            callback(null, usuarios);
        })
        /*const usuarios = fs.readFileSync(route, 'utf8');
        return JSON.parse(usuarios);*/
    },

    obtenerUsuarioPorId: (id, callback) => {
        db.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, results) => {
            if (err) return callback(err);

            if (results.length === 0) return callback(null, null);

            const user = results[0];
            callback(null, user);
        });
    },

    eliminarUsuario: (id) => {
        const usuarios = obtenerUsuarios();
        const usuario = usuarios.find(u => u.id === parseInt(id));
        if (!usuario) return false;

        if (usuario.foto && usuario.foto.startsWith('/images/')) {
            // Obtener la ruta de la foto
            const fotoPath = path.join(__dirname, '../public', usuario.foto);
            if (fs.existsSync(fotoPath)) {
                fs.unlinkSync(fotoPath);
            }
        }

        // Obteniendo los usuarios menos el que pasamos por ID en el parámetro
        const nuevosUsuarios = usuarios.filter(u => u.id !== parseInt(id));
        fs.writeFileSync(route, JSON.stringify(nuevosUsuarios, null, 2));
        return true;
    },

    crearUsuario: (datos) => {
        const usuarios = obtenerUsuarios();
        const nuevoId = usuarios.length + 1;
        const nuevoUsuario = { id: nuevoId, ...datos };
        usuarios.push(nuevoUsuario);
        fs.writeFileSync(route, JSON.stringify(usuarios, null, 2));
        return nuevoId;
    },

    actualizarUsuario: (id, nuevosDatos, callback) => {
        db.query('UPDATE usuarios SET nombre = ?, correo = ? WHERE id = ?', 
            [nuevosDatos.nombre, nuevosDatos.correo, id],
            (err) => {
                if (err) return callback(err);
                callback(null);
            }
        );
    }
}

module.exports = User;