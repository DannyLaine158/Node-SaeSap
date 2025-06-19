const fs = require('fs');
const path = require('path');
const route = path.join(__dirname, '../database/users.json');

function obtenerUsuarios() {
    const usuarios = fs.readFileSync(route, 'utf8');
    return JSON.parse(usuarios);
}

function obtenerUsuarioPorId(id) {
    // La lista completa de los usuarios
    const usuarios = obtenerUsuarios();
    return usuarios.find(u => u.id === parseInt(id));
}

function obtenerUsuarioPorId(id) {
    // La lista completa de los usuarios
    const usuarios = obtenerUsuarios();
    return usuarios.find(u => u.id === parseInt(id));
}

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId
};