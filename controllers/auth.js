/*
Importacion de modulos
*/
const { response } = require('express');
const { checkEmailInBD, checkPasswordInBD, getUserDataFromEmail, getUserData } = require('../utils/dbCalls')
const { generarJWT } = require('../helpers/jwt')
const jwt = require('jsonwebtoken');
const { isObjEmpty } = require('../utils/common')


// POST
const token = async(req, res = response) => {

  const token = req.headers['x-auth'];
  
  try {
    const { uid, rol, ...object } = jwt.verify(token, process.env.JWTSECRET);

    const userExists = await getUserData(uid)
    if (isObjEmpty(userExists)) {
      return res.status(400).send({
        error: {
          errorCode: 400,
          errorMsg: 'Not valid token' 
        }
      });
    } 

    const newToken = await generarJWT(uid, rol);
    res.status(200).send({
      ok: 200,
      msg: 'token',
      token: newToken,
      user: {
        nombre_organizacion: userExists.nombre_organizacion,
        email: userExists.email,
        image: userExists.image,
        enabled: userExists.enabled,
        rol: userExists.rol
      }
    });
  } catch (error) {
    return res.status(400).send({
      error: {
        errorCode: 400,
        errorMsg: 'Not valid token' 
      }
    });
  }

}

const login = async(req, res = response) => {

  try {
    // Get email and password from call
    const { email, password } = req.body

    // Check if email exists in BD
    const emailExists = await checkEmailInBD(email)
    if (!emailExists) {
      return res.status(400).send({
        error: {
          errorCode: 400,
          errorMsg: 'Email or password are not correct' 
        }
      });
    } 

    // Check if password is same in BD
    const validPassword = await checkPasswordInBD(password, email)
    if (!validPassword) {
      return res.status(400).json({
        error: {
          errorCode: 400,
          errorMsg: 'Email or password are not correct' 
        }
      });
    }

    // Generating JWT token
    let {id_usuario, rol, nombre_organizacion, userEmail, image, enabled} = await getUserDataFromEmail(email)
    const token = await generarJWT(id_usuario, rol);

    // Everything ok, responde 200
    res.status(200).send({
      ok: 200,
      msg: 'login',
      token: token,
      user: {
        nombre_organizacion,
        email: userEmail,
        image,
        enabled,
        rol
      }
    });

  } catch (error) {
    return res.status(400).send({
      error: {
        errorCode: 400,
        errorMsg: 'Not valid token' 
      }
    });
  }


}

module.exports = { login, token }