
/*
Importacion de modulos
*/
const { response } = require('express');
const { validationResult } = require('express-validator');
const pool = require('../database/configdb');
const { checkEmailInBD, getUserData } = require('../utils/dbCalls')
const { isObjEmpty } = require('../utils/common')

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

  const { email } = req.body

  let emailExists = await checkEmailInBD(email)

  if (emailExists) {
    return res.status(400).send({
      errorCode: 400,
      errorMsg: "Email already exists"
    });
  }
  next();

}

// Comprobar si el email que se esta intentando registrar ya existe y si es el mismo email
//  que el del usuario que hace la petición 
const checkEmailExistsPUT = async (req, res = response, next) => {
  const { id } = req.params
  const { email } = req.body
  let emailExists = await checkEmailInBD(email)
  let emailGet = await getUserData(id)

  console.log('emailExists', emailExists);
  console.log('email', email);
  console.log('emailGet', emailGet.email)

  if (emailExists) {
    if (email !== emailGet.email) {
      return res.status(400).send({
        errorCode: 400,
        errorMsg: "Email exists but is not yours"
      });
    }
  }
  next();
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

const checkCompanyRol = async (req, res = response, next) => {

  const { id } = req.params
  const rol = await pool.query('SELECT `rol` FROM `users` WHERE id_usuario = ?', [id])

  if (rol && rol === 'empresa') {
    next();
  }else {
    return res.status(400).send({
      errorCode: 400,
      errorMsg: "This user is not Company Rol"
    });
  }

}

module.exports = { validarCampos, checkEmailexists, checkEmailExistsPUT, checkUserExists, checkCompanyRol }