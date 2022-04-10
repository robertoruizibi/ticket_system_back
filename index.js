/*
Importacion de modulos
*/
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload')
require('dotenv').config();

// Crear una aplicación de express
const app = express();

// Usar cors
app.use(cors());  
app.use(express.json());
app.use(fileUpload({
    limits: { fileSize: process.env.MAXSIZEUPLOAD * 1042 * 1024 },
    abortOnLimit: true,
    createParentPath: true
}));

// app.use('/users', require('./routes/users'))

app.use('/api/users', require('./routes/users'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/login', require('./routes/auth'));

app.use('/api/upload', require('./routes/uploads'));

// Abrir la aplicacíon en el puerto 3000
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});