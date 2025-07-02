// Requerimos el módulo de Express
const express = require('express');
// Inicializamos a Express
const app = express();
// Buscamos puerto disponible
const PORT = process.env.PORT || 3000;
const path = require('path');

// Configuración para cargar las variables de entorno
require('dotenv').config();

// Middleware: Configuración previa para que funcione el servidor
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ // Para leer los datos del formulario
    extended: true
}));

// Middleware: Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Enrutador
const mainRoutes = require('./routes/router');
app.use('/', mainRoutes);

// Inicializar servidor web
app.listen(PORT, function () {
    console.log("Server on port ", PORT);
});