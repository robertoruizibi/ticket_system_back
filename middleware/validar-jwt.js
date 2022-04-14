const jwt = require('jsonwebtoken');
const { getUserData } = require('../utils/dbCalls')
const { isObjEmpty } = require('../utils/common')


const validarJWT = (req, res, next) => {
  const token = req.header('x-auth');
  
  if (!token) {
    return res.status(401).json({
      ok: 401,
      msg: 'Token needed'
    });
  }
  try {
    const { uid, rol, ...object } = jwt.verify(token, process.env.JWTSECRET);
    req.uid = uid;
    req.rol = rol;
    next();
  } catch (err) {
    return res.status(401).json({
      ok: 401,
      msg: 'Not valid token'
    })
  }
}

const verifyAdminRol = async (req, res, next) => {

  const token = req.headers['x-auth'];

  try {
    
    const { uid, rol, ...object } = jwt.verify(token, process.env.JWTSECRET);
    const userExists = await getUserData(uid)
    console.log("🚀 ~ file: validar-jwt.js ~ line 32 ~ verifyAdminRol ~ userExists", userExists)
    if (isObjEmpty(userExists)) {
      return res.status(400).send({
        errorCode: 400,
        errorMsg: 'Not valid token' 
      });
    } 

    if (userExists.rol !== 'empresa') {
      return res.status(401).send({
        errorCode: 401,
        errorMsg: 'You do not have the required permissions' 
      });
    } 
    
    next();

  } catch (error) {
    return res.status(400).send({
      errorCode: 400,
      errorMsg: 'Not valid token' 
    });
  }

}

module.exports = { validarJWT, verifyAdminRol }