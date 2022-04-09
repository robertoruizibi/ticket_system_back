/*
Importacion de modulos
*/
const pool = require('../database/configdb');
const { getUsers, getNumUsers, getSignleUser, createUser, updateUser, updatePassword, deleteUser } = require('../utils/dbCalls')

// GET
const enviarArchivo = async (req, res) => {

  try {

    res.status(200).send({
      ok: 200,
      msg: 'File served succesfully',
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error serving file: " + error
    });

  }

}

// POST
const subirArchivo = async (req, res) => {

  try {

    res.status(200).send({
      ok: 200,
      msg: "File uploaded succesfully"
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error uploading file: " + error
    });

  }

}


module.exports = { enviarArchivo, subirArchivo }