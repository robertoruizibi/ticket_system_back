const jwt = require('jsonwebtoken');
const validarJWT = (req, res, next) => {
  const token = req.header('x-auth');
  
  if (!token) {
    return res.status(401).json({
      ok: 401,
      msg: 'Falta token de autorización'
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
      msg: 'Token no válido'
    })
  }
}
module.exports = { validarJWT }