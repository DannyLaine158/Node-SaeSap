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

    eliminarUsuario: (id, callback) => {
        db.query("DELETE FROM usuarios WHERE id = ?", [id], (err) => {
            if (err) return callback(err);

            callback(null);
        });
    },

    crearUsuario: (datos, callback) => {
        db.query("INSERT INTO usuarios (nombre, correo) VALUES (?, ?)",
            [ datos.nombre, datos.correo ],
            (err, result) => {
                if (err) return callback(err);

                callback(null, result.insertId);
            }
        )
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