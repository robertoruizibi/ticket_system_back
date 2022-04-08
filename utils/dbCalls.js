/*
Importacion de modulos
*/
const pool = require('../database/configdb');
const bcrypt = require('bcryptjs');
const _ = require("lodash");

//---------------------------------------------------------------//
const getFirstQueryValue = (value) => { return Object.values(value[0])[0] }

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
//---------------------------------------------------------------//

module.exports = { checkEmailInBD, checkPasswordInBD }