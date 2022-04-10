
/*
Importacion de modulos
*/
const { response } = require('express');
const { validationResult } = require('express-validator');
const pool = require('../database/configdb');
const { checkEmailInBD, getUserData, getTicketData } = require('../utils/dbCalls')
const { isObjEmpty, queryResultToObject } = require('../utils/common')

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

  if (emailExists) {
    if (email !== emailGet.email) {
      return res.status(400).send({
        errorCode: 400,
        errorMsg: "Email already exists"
      });
    }
  }
  next();
}

// Comprobar si el usuario existe
const checkUserExists = async (req, res = response, next) => {

  const { id } = req.params
  const usuario = queryResultToObject(await getUserData(id))

  if (id && !isObjEmpty(usuario)) {
    next();
  }else {
    return res.status(400).send({
      errorCode: 400,
      errorMsg: "This user does not exist"
    });
  }

}

const checkManagerExists = async (req, res = response, next) => {

  const { responsable } = req.body
  const user = queryResultToObject(await pool.query('SELECT * FROM `users` WHERE id_usuario = ?', [responsable]))

  if (responsable && !isObjEmpty(user) && user.rol === 'empresa') {
    next();
  }else {
    return res.status(400).send({
      errorCode: 400,
      errorMsg: "This manager does not exist"
    });
  }

}

const checkClientExists = async (req, res = response, next) => {

  const { cliente } = req.body
  const user = queryResultToObject(await pool.query('SELECT * FROM `users` WHERE id_usuario = ?', [cliente]))

  if (cliente && !isObjEmpty(user) && user.rol === 'cliente') {
    next();
  }else {
    return res.status(400).send({
      errorCode: 400,
      errorMsg: "This client does not exist"
    });
  }

}

const checkTicketExists = async (req, res = response, next) => {

  const { responsable, cliente, titulo } = req.body
  const title = queryResultToObject(await pool.query('SELECT titulo FROM `tickets` WHERE responsable = ? AND cliente = ?', [responsable, cliente]))

  if (title.titulo !== titulo) {
    next();
  }else {
    return res.status(400).send({
      errorCode: 400,
      errorMsg: "This ticket already exists"
    });
  }

}

const checkTicketExistsPUT = async (req, res = response, next) => {
  const { id } = req.params
  const { responsable, cliente, titulo } = req.body
  let ticketExists = queryResultToObject(await pool.query('SELECT * FROM `tickets` WHERE responsable = ? AND cliente = ? AND titulo = ?', [responsable, cliente, titulo]))
  let ticketGet = await getTicketData(id)


  if (!isObjEmpty(ticketExists) && !isObjEmpty(ticketGet)) {

    if (ticketExists.id_ticket !== ticketGet.id_ticket) {
      return res.status(400).send({
        errorCode: 400,
        errorMsg: "Ticket already exists"
      });
    }
  }
  next();
}

const checkTicketExistsDELETE = async (req, res = response, next) => {
  const { id } = req.params
  let ticketExists = queryResultToObject(await pool.query('SELECT * FROM `tickets` WHERE id_ticket = ?', [id]))

  if (isObjEmpty(ticketExists)) {
    return res.status(400).send({
      errorCode: 400,
      errorMsg: "Ticket does not exist"
    });
  }
  next();
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

module.exports = { validarCampos, checkEmailexists, checkEmailExistsPUT, checkUserExists, checkCompanyRol, checkManagerExists, checkClientExists, checkTicketExists, checkTicketExistsPUT, checkTicketExistsDELETE }