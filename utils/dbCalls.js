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

const getSignleUser = async (id) => {
  return queryResultToObject(await pool.query('SELECT * FROM `users` WHERE id_usuario = ?', [id]))
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

module.exports = { checkEmailInBD, checkPasswordInBD, getUserDataFromEmail, getUserData, getUsers, getNumUsers, getSignleUser, createUser, updateUser, updatePassword, deleteUser, updateBD }