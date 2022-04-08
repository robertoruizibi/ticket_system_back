/*
Importacion de modulos
*/
const { response } = require('express');
const { checkEmailInBD, checkPasswordInBD } = require('../utils/dbCalls')
const { generarJWT } = require('../helpers/jwt')

// Create salt for hashing passwords

// POST
const login = async(req, res = response) => {

  try {
    // Get email and password from call
    const { email, password } = req.body

    // Check if email exists in BD
    const emailExists = await checkEmailInBD(email)
    if (!emailExists) {
      return res.status(400).send({
        errorCode: 400,
        errorMsg: 'Email or password are not correct'
      });
    } 

    // Check if password is same in BD
    const validPassword = await checkPasswordInBD(password, email)
    console.log('validPassword', validPassword);
    if (!validPassword) {
      return res.status(400).json({
        errorCode: 400,
        errorMsg: 'Email or password are not correct',
      });
    }

     // Generating JWT token
    // const token = await generarJWT(usuarioBD._id, usuarioBD.rol);

    // Everything ok, responde 200
    res.status(200).send({
      ok: 200,
      msg: 'login',
      token: 'token'
    });

  } catch (error) {
    
  }


}

module.exports = { login }