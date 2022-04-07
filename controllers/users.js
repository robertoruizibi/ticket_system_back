/*
Importacion de modulos
*/
const pool = require('../database/configdb');
var bcrypt = require('bcryptjs');

// Create salt for hashing passwords
var salt = bcrypt.genSaltSync(10);

// Load hash from your password DB.
// bcrypt.compareSync("B4c0/\/", hash); // true
// bcrypt.compareSync("not_bacon", hash); // false

// GET
const getUsuarios = async (req, res) => {

  try {

    const usuarios = await pool.query('SELECT * FROM `users`')

    res.json({
      ok: true,
      msg: 'getUsuarios',
      usuarios: usuarios
    })

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Server error"
    });

  }

}

const getUsuario = async (req, res) => {

  try {

    const { id } = req.params
    const usuario = await pool.query('SELECT * FROM `users` WHERE id_usuario = ?', [id])

    res.json({
      ok: true,
      msg: 'getUsuario',
      usuarios: usuario
    })

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Server error"
    });

  }

}

// POST
const createUsuario = async (req, res) => {

  try {

    const { nombre_organizacion, email, password, image, enabled } = req.body

      const newUser = {
        nombre_organizacion,
        email,
        password: bcrypt.hashSync(password, salt),
        image: image === undefined ? '/img/default.jpg' : image,
        enabled: true
      }
      const post = await pool.query('INSERT INTO `users` set ?', [newUser])
      return res.status(200).send({
      ok: 200,
      msg: "Successful"
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error creating user: " + error
    });

  }

}

// PUT
const actualizarUsuario = async (req, res) => {

  try {

    const { id } = req.params
    const { nombre_organizacion, email, password, image, enabled } = req.body

    await pool.query('UPDATE `users` SET `nombre_organizacion` = ? WHERE `users`.`id_usuario` = ?', [nombre_organizacion, id])
    await pool.query('UPDATE `users` SET `email` = ? WHERE `users`.`id_usuario` = ?', [email, id])
    await pool.query('UPDATE `users` SET `password` = ? WHERE `users`.`id_usuario` = ?', [bcrypt.hashSync(password, salt), id])
    
    if (image && image !== undefined && image !== '') {
      await pool.query('UPDATE `users` SET `image` = ? WHERE `users`.`id_usuario` = ?', [image, id])
    }else {
      let defaultImage = '/img/default.jpg'
      await pool.query('UPDATE `users` SET `image` = ? WHERE `users`.`id_usuario` = ?', [defaultImage, id])
    }
    await pool.query('UPDATE `users` SET `enabled` = ? WHERE `users`.`id_usuario` = ?', [enabled, id])

    return res.status(200).send({
      ok: 200,
      msg: "Successful"
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error updating user: " + error
    });

  }

}

// PUT
const actualizarContraseña = async (req, res) => {

  try {

    const { id } = req.params
    const { password } = req.body

    await pool.query('UPDATE `users` SET `password` = ? WHERE `users`.`id_usuario` = ?', [bcrypt.hashSync(password, salt), id])

    return res.status(200).send({
      ok: 200,
      msg: "Successful"
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Server error"
    });

  }

}

// DELETE
const borrarUsuario = async (req, res) => {

  try {

    const { id } = req.params

    await pool.query('DELETE FROM `users` WHERE id_usuario = ?', [id])

    return res.status(200).send({
      ok: 200,
      msg: "Successful"
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Server error"
    });

  }

}

module.exports = { getUsuarios, getUsuario, createUsuario, borrarUsuario, actualizarUsuario, actualizarContraseña }