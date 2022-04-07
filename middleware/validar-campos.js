
/*
Importacion de modulos
*/
const { response } = require('express');
const { validationResult } = require('express-validator');
const pool = require('../database/configdb');
const { isObjEmpty, isArrayEmpty } = require('../utils/common')

// Comprobar con express validator si los campos existen
const validarCampos = (req, res = response, next) => {

  const erroresVal = validationResult(req);
  if (!erroresVal.isEmpty()) {
    return res.status(400).send({
      errorCode: 400,
      errorMsg: erroresVal.mapped()
    });
  }
  next();

}

// Comprobar si el email que se esta intentando registrar ya existe
const checkEmailexists = async (req, res = response, next) => {

  const users_emails = await pool.query('SELECT email FROM `users`')
  const { nombre_organizacion, email, password, image } = req.body

  let userEmailsArray = []
  users_emails.forEach(element => {userEmailsArray.push(element.email)});
  let emailIndex = userEmailsArray.findIndex(emailArr => emailArr === email)

  if (emailIndex === -1) {
    next();
  }else {
    return res.status(400).send({
      errorCode: 400,
      errorMsg: "Email already exists"
    });
  }

}

// Comprobar si el usuario existe
const checkUserExists = async (req, res = response, next) => {

  const { id } = req.params
  const usuario = await pool.query('SELECT * FROM `users` WHERE id_usuario = ?', [id])

  if (id && !isObjEmpty(usuario)) {
    next();
  }else {
    return res.status(400).send({
      errorCode: 400,
      errorMsg: "This user does not exist"
    });
  }

}

module.exports = { validarCampos, checkEmailexists, checkUserExists }