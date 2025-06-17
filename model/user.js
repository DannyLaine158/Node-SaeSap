let usuarios = [
    { id: 1, nombre: "Daniel", correo: 'daniel@mail.com' },
    { id: 2, nombre: "Luis", correo: 'luis@mail.com' },
    { id: 3, nombre: "Juan", correo: 'juan@mail.com' },
    { id: 4, nombre: "Brian", correo: 'brian@mail.com' }
];

function obtenerUsuarios() {
    return usuarios;
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