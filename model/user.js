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

function eliminarUsuario(id) {
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
}

function crearUsuario(datos) {
    const usuarios = obtenerUsuarios();
    const nuevoId = usuarios.length + 1;
    const nuevoUsuario = { id: nuevoId, ...datos };
    usuarios.push(nuevoUsuario);
    fs.writeFileSync(route, JSON.stringify(usuarios, null, 2));
    return nuevoId;
}

function actualizarUsuario(id, nuevosDatos) {
    const usuarios = obtenerUsuarios();

    // Obtenemos al indice del usuario que estamos buscando
    const index = usuarios.findIndex(u => u.id === parseInt(id));

    if (index === -1) {
        return res.status(404).send("Usario no encontrado");
    } else {
        usuarios[index] = { ...usuarios[index], ...nuevosDatos };
        fs.writeFileSync(route, JSON.stringify(usuarios, null, 2));
    }
}

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    eliminarUsuario,
    crearUsuario,
    actualizarUsuario
};