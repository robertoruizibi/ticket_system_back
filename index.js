/*
Importacion de modulos
*/
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Crear una aplicación de express
const app = express();

// Usar cors
app.use(cors());  
app.use(express.json());

// app.use('/users', require('./routes/users'))

app.use('/api/users', require('./routes/users'));
app.use('/api/login', require('./routes/auth'));

// Abrir la aplicacíon en el puerto 3000
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});