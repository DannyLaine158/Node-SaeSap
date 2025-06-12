// Requerimos el módulo de Express
const express = require('express');
// Inicializamos a Express
const app = express();
// Buscamos puerto disponible
const PORT = 3000;
const path = require('path');

// Middleware: Configuración previa para que funcione el servidor
app.use(express.static(path.join(__dirname, 'public')));

// Enrutador
const mainRoutes = require('./routes/router');
app.use('/', mainRoutes);

// Inicializar servidor web
app.listen(PORT, function () {
    console.log("Server on port ", PORT);
});