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

const getUsers = async (desde = 0, registropp = 10, typeOrder = 'name', asc='asc') => {
  const supportedFilters = ['name', 'email', 'enabled', 'date']
  if (!supportedFilters.includes(typeOrder)) return false
  if (typeOrder === 'name') typeOrder = 'nombre_organizacion'
  if (typeOrder === 'date') typeOrder = 'id_usuario'
  return await pool.query(`SELECT id_usuario, nombre_organizacion, email, image, enabled, rol FROM users ORDER BY ${typeOrder} ${asc} LIMIT ? , ?`, [desde, registropp])
}

const getNumUsers = async () => {
  return getFirstQueryValue(await pool.query('SELECT COUNT(*) FROM `users`'))
}

const createUser = async ({ nombre_organizacion, email, password }) => {
  const newUser = {
    nombre_organizacion,
    email,
    password: bcrypt.hashSync(password),
    enabled: true
  }
  await pool.query('INSERT INTO `users` set ?', [newUser])
  return getUserDataFromEmail(email)
}

const updateUser = async ({ nombre_organizacion, email, enabled }, id) => {
  await pool.query('UPDATE `users` SET `nombre_organizacion` = ? WHERE `users`.`id_usuario` = ?', [nombre_organizacion, id])
  await pool.query('UPDATE `users` SET `email` = ? WHERE `users`.`id_usuario` = ?', [email, id])
  // if (image && image !== undefined && image !== '') {
  //   await pool.query('UPDATE `users` SET `image` = ? WHERE `users`.`id_usuario` = ?', [image, id])
  // }else {
  //   let defaultImage = `${process.env.DEFAULT_PROFILE_IMAGE}`
  //   await pool.query('UPDATE `users` SET `image` = ? WHERE `users`.`id_usuario` = ?', [defaultImage, id])
  // }
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

const insetFileBD = async ( fileName, id ) => {
  await pool.query('UPDATE `reports` SET `archivo_adjunto` = ? WHERE `reports`.`id_reporte` = ?', [fileName, id])
}

const updateBD = async (tipo, path, fileName, id) => {
 
  switch (tipo) {
    case 'fotoPerfil':
        const user = await getUserData(id)
        if (isObjEmpty(user)) {
          return false
        }

        const oldImage = user.image
        if (oldImage !== process.env.DEFAULT_PROFILE_IMAGE) {
          const pathOldImage = `${process.env.PATHUPLOAD}/fotoPerfil/${oldImage}`
          if (oldImage  && fs.existsSync(pathOldImage)) {
            fs.unlinkSync(pathOldImage)
          }
        }
       
        await insetImageBD(`${fileName}`, id)

        return true

      break;

    case 'ficheroReporte':
      
      const report = await getReportData(id)
      if (isObjEmpty(report)) {
        return false
      }

      const oldFile = report.archivo_adjunto
      const pathOldFile = `${process.env.PATHUPLOAD}/ficheroReporte/${oldFile}`
      if (oldFile  && fs.existsSync(pathOldFile)) {
        fs.unlinkSync(pathOldFile)
      }
      await insetFileBD(`${fileName}`, id)

      return true
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

const deleteFileBd = async (file, type, id) => {
  const path = `${process.env.PATHUPLOAD}/${type}`
  let uploadPath = `${path}/${file}`

  if (!fs.existsSync(uploadPath)) {
    return false
  }

  fs.unlinkSync(uploadPath)

  switch (type) {
    case process.env.PROFILE_PHOTO_TYPE:
      await pool.query('UPDATE `users` SET `image` = ? WHERE `users`.`id_usuario` = ?', [process.env.DEFAULT_PROFILE_IMAGE, id])
      break;

    case process.env.PROFILE_REPORT_TYPE:
      await pool.query('UPDATE `reports` SET `archivo_adjunto` = ? WHERE `reports`.`id_reporte` = ?', ['', id])
      break;
  
    default:
      break;
  }
}

//---------------------------------------------------------------//
//                       TICKETS QUERIES                         //
//---------------------------------------------------------------//
const getTicketData = async (id) => {
  return queryResultToObject(await pool.query('SELECT * FROM `tickets` WHERE id_ticket = ?', [id]))
}

const getTicketFromRespAndCust = async (responsable, cliente) => {
  return queryResultToObject(await pool.query('SELECT titulo FROM `tickets` WHERE responsable = ? AND cliente = ?', [responsable, cliente]))
}

const getTicketFromRespAndCustTit = async (responsable, cliente, titulo) => {
  return queryResultToObject(await pool.query('SELECT * FROM `tickets` WHERE responsable = ? AND cliente = ? AND titulo = ?', [responsable, cliente, titulo]))
}

const getTicketsFromCustomerUser = async (id) => {
  return await pool.query('SELECT * FROM `tickets` WHERE cliente = ?', [id])
}

const getTicketsBd = async (desde = 0, registropp = 10, typeOrder = 'title', asc='asc') => {
  const supportedFilters = ['title', 'priority', 'enabled', 'date']
  if (!supportedFilters.includes(typeOrder)) return false
  if (typeOrder === 'title') typeOrder = 'titulo'
  else if (typeOrder === 'priority') typeOrder = 'prioridad'
  else if (typeOrder === 'date') typeOrder = 'id_ticket'
  return await pool.query(`SELECT * FROM tickets ORDER BY ${typeOrder} ${asc} LIMIT ? , ?`, [desde, registropp])
}

const getUserTicketsBd = async (id, rol, desde = 0, registropp = 10, typeOrder = 'title', asc='asc') => {
  const supportedFilters = ['title', 'priority', 'enabled', 'date']
  if (!supportedFilters.includes(typeOrder)) return false
  if (typeOrder === 'title') typeOrder = 'titulo'
  else if (typeOrder === 'priority') typeOrder = 'prioridad'
  else if (typeOrder === 'date') typeOrder = 'id_ticket'
  if (rol === 'empresa') rol = 'responsable'
  return await pool.query(`SELECT * FROM tickets where ${rol} = ? ORDER BY ${typeOrder} ${asc} LIMIT ? , ?`, [id, desde, registropp])
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

const getNumDatesToDelete = async (id) => {
  return getFirstQueryValue(await pool.query('SELECT COUNT(*) FROM `dates` WHERE id_ticket = ?', [id]))
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
  let numDates = await getNumDatesToDelete(id)
  if (numDates > 0) {
    await pool.query('DELETE FROM `dates` WHERE id_ticket = ?', [id])
  }
}

//---------------------------------------------------------------//
//                       REPORTS QUERIES                         //
//---------------------------------------------------------------//

const getReportData = async (id) => {
  return queryResultToObject(await pool.query('SELECT * FROM `reports` WHERE id_reporte = ?', [id]))
}

const getAllReportsBd = async (desde = 0, registropp = 10) => {
  return await pool.query('SELECT * FROM `reports` LIMIT ? , ?', [desde, registropp])
}

const getReportsBd = async (id, desde = 0, registropp = 10) => {
  return await pool.query('SELECT * FROM `reports` WHERE id_ticket = ? LIMIT ? , ?', [id, desde, registropp])
}

const getNumReportsAll = async (id) => {
  return getFirstQueryValue(await pool.query('SELECT COUNT(*) FROM `reports`'))
}

const getNumReports = async (id) => {
  return getFirstQueryValue(await pool.query('SELECT COUNT(*) FROM `reports` where id_ticket = ?', [id]))
}

const createReportBd = async ({ contenido, fecha_creacion, archivo_adjunto, visto, id_ticket}) => {
  const newReport = {
    contenido,
    fecha_creacion,
    archivo_adjunto,
    visto,
    id_ticket,
  }
  return queryResultToObject(await pool.query('INSERT INTO `reports` set ?', [newReport]))
}

const updateReportBd = async ({ contenido, fecha_creacion, archivo_adjunto, visto, id_ticket}, id) => {
  await pool.query('UPDATE `reports` SET `contenido` = ? WHERE `reports`.`id_reporte` = ?', [contenido, id])
  await pool.query('UPDATE `reports` SET `fecha_creacion` = ? WHERE `reports`.`id_reporte` = ?', [fecha_creacion, id])
  await pool.query('UPDATE `reports` SET `archivo_adjunto` = ? WHERE `reports`.`id_reporte` = ?', [archivo_adjunto, id])
  await pool.query('UPDATE `reports` SET `visto` = ? WHERE `reports`.`id_reporte` = ?', [visto, id])
  await pool.query('UPDATE `reports` SET `id_ticket` = ? WHERE `reports`.`id_reporte` = ?', [id_ticket, id])
}

const deleteReportBd = async (id) => {
  await pool.query('DELETE FROM `reports` WHERE id_reporte = ?', [id])
}

const deleteAllReportsFromTicketBd = async (id) => {
  let numReports = await getNumReports(id)
  if (numReports > 0){
    await pool.query('DELETE FROM `reports` WHERE id_ticket = ?', [id])
  }
}

module.exports = { checkEmailInBD, checkPasswordInBD, getUserDataFromEmail, getUserData, getUsers, getNumUsers, getUserData, createUser, updateUser, updatePassword, deleteUser, updateBD, deleteFileBd, getTicketsBd, getTicketData, getUserTicketsBd, getNumTickets, createTicketBd, updateTicketBd, deleteTicketBd, getDatesBd, getNumDates, getDateData, createDateBd, updateDatetBd, deleteDateBd, getAllReportsBd, getReportsBd, getNumReportsAll, getNumReports, getReportData, createReportBd, updateReportBd, deleteReportBd, deleteAllReportsFromTicketBd, getTicketsFromCustomerUser, getTicketFromRespAndCust, getTicketFromRespAndCustTit }