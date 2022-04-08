const jwt = require('jsonwebtoken');
const generarJWT = (uid, rol) => {
  return new Promise((resolve, reject) => {
    const payload = {
      uid,
      rol
    }
    jwt.sign(payload, process.env.JWTSECRET, {
      expiresIn: '24h'
    }, (err, token) => {
      if (err) {
        console.log(err);
        reject('JWT could not be loaded');
      } else {
        resolve(token);
      }
    });
  });
}
module.exports = { generarJWT }