/*
Importacion de modulos
*/
const pool = require('../database/configdb');
const bcrypt = require('bcryptjs');
const { getFirstQueryValue, queryResultToObject, isObjEmpty } = require('./common')
const fs = require('fs')

//---------------------------------------------------------------//
//                         LOGIN QUERIES                         //
//---------------------------------------------------------------//
const checkEmailInBD = async (email) => {
  const users_emails = await pool.query('SELECT email FROM `users`')
  let userEmailsArray = []
  users_emails.forEach(element => {userEmailsArray.push(element.email)});
  return userEmailsArray.findIndex(emailArr => emailArr === email) !== -1
}

const checkPasswordInBD = async (password, email) => {
  const user_password = await pool.query('SELECT password FROM `users` WHERE email = ?', [email])
  return bcrypt.compareSync(password, getFirstQueryValue(user_password));
}

const getUserDataFromEmail = async (paramEemail) => {
  let call = await pool.query('SELECT * FROM `users` WHERE email = ?', [paramEemail])
  return queryResultToObject(call)
}

//---------------------------------------------------------------//
//                          USER QUERIES                         //
//---------------------------------------------------------------//
const getUserData = async (id) => {
  return queryResultToObject(await pool.query('SELECT * FROM `users` WHERE id_usuario = ?', [id]))
}

const getUsers = async (desde = 0, registropp = 10) => {
  return await pool.query('SELECT * FROM `users` LIMIT ? , ?', [desde, registropp])
}

const getNumUsers = async () => {
  return getFirstQueryValue(await pool.query('SELECT COUNT(*) FROM `users`'))
}

const createUser = async ({ nombre_organizacion, email, password, image }) => {
  const newUser = {
    nombre_organizacion,
    email,
    password: bcrypt.hashSync(password),
    image: image === undefined ? '/img/default.jpg' : image,
    enabled: true
  }
  return queryResultToObject(await pool.query('INSERT INTO `users` set ?', [newUser]))
}

const updateUser = async ({ nombre_organizacion, email, image, enabled }, id) => {
  await pool.query('UPDATE `users` SET `nombre_organizacion` = ? WHERE `users`.`id_usuario` = ?', [nombre_organizacion, id])
  await pool.query('UPDATE `users` SET `email` = ? WHERE `users`.`id_usuario` = ?', [email, id])
  if (image && image !== undefined && image !== '') {
    await pool.query('UPDATE `users` SET `image` = ? WHERE `users`.`id_usuario` = ?', [image, id])
  }else {
    let defaultImage = '/img/default.jpg'
    await pool.query('UPDATE `users` SET `image` = ? WHERE `users`.`id_usuario` = ?', [defaultImage, id])
  }
  await pool.query('UPDATE `users` SET `enabled` = ? WHERE `users`.`id_usuario` = ?', [enabled, id])
}

const updatePassword = async ({ password }, id) => {
  await pool.query('UPDATE `users` SET `password` = ? WHERE `users`.`id_usuario` = ?', [bcrypt.hashSync(password), id])
}

const deleteUser = async (id) => {
  pool.query('DELETE FROM `users` WHERE id_usuario = ?', [id])
}


//---------------------------------------------------------------//
//                        UPLOAD QUERIES                         //
//---------------------------------------------------------------//

const insetImageBD = async ( fileName, id ) => {
  await pool.query('UPDATE `users` SET `image` = ? WHERE `users`.`id_usuario` = ?', [fileName, id])
}

const updateBD = async (tipo, path, fileName, id) => {
 
  switch (tipo) {
    case 'fotoPerfil':
        const user = await getUserData(id)
        if (isObjEmpty(user)) {
          return false
        }

        const oldImage = user.image
        const pathOldImage = `${oldImage}`
        console.log('pathOldImage', pathOldImage);
        console.log('oldImage  && fs.existsSync(pathOldImage)', oldImage  && fs.existsSync(pathOldImage));
        console.log('oldImage', oldImage);
        console.log('fs.existsSync(pathOldImage)', fs.existsSync(pathOldImage));
        if (oldImage  && fs.existsSync(pathOldImage)) {
          fs.unlinkSync(pathOldImage)
        }
       
        await insetImageBD(`${fileName}`, id)

        return true

      break;

    case 'ficheroReporte':
     
      break;
  
    default:
        return res.status(400).send({
          ok: 400,
          msg: `This type of operation is not allowed`,
          type: tipo
        });
      break;
  }
}

//---------------------------------------------------------------//
//                       TICKETS QUERIES                         //
//---------------------------------------------------------------//
const getTicketData = async (id) => {
  return queryResultToObject(await pool.query('SELECT * FROM `tickets` WHERE id_ticket = ?', [id]))
}

const getTicketsBd = async (desde = 0, registropp = 10) => {
  return await pool.query('SELECT * FROM `tickets` LIMIT ? , ?', [desde, registropp])
}

const getNumTickets = async () => {
  return getFirstQueryValue(await pool.query('SELECT COUNT(*) FROM `tickets`'))
}

const createTicketBd = async ({ prioridad, responsable, cliente, titulo, enabled }) => {
  const newTicket = {
    prioridad,
    responsable,
    cliente,
    titulo,
    enabled
  }
  return queryResultToObject(await pool.query('INSERT INTO `tickets` set ?', [newTicket]))
}

const updateTicketBd = async ({ prioridad, responsable, cliente, titulo, enabled }, id) => {
  await pool.query('UPDATE `tickets` SET `prioridad` = ? WHERE `tickets`.`id_ticket` = ?', [prioridad, id])
  await pool.query('UPDATE `tickets` SET `responsable` = ? WHERE `tickets`.`id_ticket` = ?', [responsable, id])
  await pool.query('UPDATE `tickets` SET `cliente` = ? WHERE `tickets`.`id_ticket` = ?', [cliente, id])
  await pool.query('UPDATE `tickets` SET `titulo` = ? WHERE `tickets`.`id_ticket` = ?', [titulo, id])
  await pool.query('UPDATE `tickets` SET `enabled` = ? WHERE `tickets`.`id_ticket` = ?', [enabled, id])
}

const deleteTicketBd = async (id) => {
  await pool.query('DELETE FROM `tickets` WHERE id_ticket = ?', [id])
}

//---------------------------------------------------------------//
//                        FECHAS QUERIES                         //
//---------------------------------------------------------------//

const getDateData = async (id) => {
  return queryResultToObject(await pool.query('SELECT * FROM `dates` WHERE id_ticket = ?', [id]))
}

const getDatesBd = async (desde = 0, registropp = 10) => {
  return await pool.query('SELECT * FROM `dates` LIMIT ? , ?', [desde, registropp])
}

const getNumDates = async () => {
  return getFirstQueryValue(await pool.query('SELECT COUNT(*) FROM `dates`'))
}

const createDateBd = async ({ fecha_creacion, fecha_actualizacion, ultima_fecha_consulta_cliente, id_ticket }) => {
  const newDate = {
    fecha_creacion,
    fecha_actualizacion,
    ultima_fecha_consulta_cliente,
    id_ticket
  }
  return queryResultToObject(await pool.query('INSERT INTO `dates` set ?', [newDate]))
}

const updateDatetBd = async ({ fecha_creacion, fecha_actualizacion, ultima_fecha_consulta_cliente, id_ticket }, id) => {
  await pool.query('UPDATE `dates` SET `fecha_creacion` = ? WHERE `dates`.`id_ticket` = ?', [fecha_creacion, id])
  await pool.query('UPDATE `dates` SET `fecha_actualizacion` = ? WHERE `dates`.`id_ticket` = ?', [fecha_actualizacion, id])
  await pool.query('UPDATE `dates` SET `ultima_fecha_consulta_cliente` = ? WHERE `dates`.`id_ticket` = ?', [ultima_fecha_consulta_cliente, id])
  await pool.query('UPDATE `dates` SET `id_ticket` = ? WHERE `dates`.`id_ticket` = ?', [id_ticket, id])
}

const deleteDateBd = async (id) => {
  await pool.query('DELETE FROM `dates` WHERE id_ticket = ?', [id])
}

module.exports = { checkEmailInBD, checkPasswordInBD, getUserDataFromEmail, getUserData, getUsers, getNumUsers, getUserData, createUser, updateUser, updatePassword, deleteUser, updateBD, getTicketsBd, getTicketData, getNumTickets, createTicketBd, updateTicketBd, deleteTicketBd, getDatesBd, getNumDates, getDateData, createDateBd, updateDatetBd, deleteDateBd }