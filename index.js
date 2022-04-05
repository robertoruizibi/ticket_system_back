/*
Importación de módulos
*/
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Crear una aplicación de express
const app = express();

// Usar cors
app.use(cors());  
app.use(express.json());

app.use('/users', require('./routes/usuarios'))

// Abrir la aplicacíon en el puerto 3000
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});

app.use('/api/users', require('./routes/usuarios'));