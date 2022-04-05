/*
Importación de módulos
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
    console.log('usuarios', usuarios)

    res.json({
      ok: true,
      msg: 'getUsuarios',
      usuarios: usuarios
    })

  } catch (error) {

    res.sendStatus(500);

  }

}

// POST
const createUsuario = async (req, res) => {

  try {

    const { nombre_organizacion, email, password, image } = req.body

    const newUser = {
      nombre_organizacion,
      email,
      password: bcrypt.hashSync(password, salt),
      image: image === undefined ? '' : image,
      enabled: true
    }

    const post = await pool.query('INSERT INTO `users` set ?', [newUser])

    res.sendStatus(200);

  } catch (error) {

    res.sendStatus(500);

  }

}

// PUT
const actualizarUsuario = async (req, res) => {

  try {

    const { id } = req.params
    const { nombre_organizacion, email, password, image, enabled } = req.body

    if (nombre_organizacion !== undefined) await pool.query('UPDATE `users` SET `nombre_organizacion` = ? WHERE `users`.`id_usuario` = ?', [nombre_organizacion, id])
    if (email !== undefined) await pool.query('UPDATE `users` SET `email` = ? WHERE `users`.`id_usuario` = ?', [email, id])
    if (password !== undefined) await pool.query('UPDATE `users` SET `password` = ? WHERE `users`.`id_usuario` = ?', [bcrypt.hashSync(password, salt), id])
    if (image !== undefined) await pool.query('UPDATE `users` SET `image` = ? WHERE `users`.`id_usuario` = ?', [image, id])
    if (enabled !== undefined) await pool.query('UPDATE `users` SET `enabled` = ? WHERE `users`.`id_usuario` = ?', [enabled, id])

    res.sendStatus(200);

  } catch (error) {

    res.sendStatus(500);

  }

}

// PUT
const actualizarContraseña = async (req, res) => {

  try {

    const { id } = req.params
    const { password } = req.body

    if (password !== undefined) await pool.query('UPDATE `users` SET `password` = ? WHERE `users`.`id_usuario` = ?', [bcrypt.hashSync(password, salt), id])

    res.sendStatus(200);

  } catch (error) {

    res.sendStatus(500);

  }

}

// DELETE
const borrarUsuario = async (req, res) => {

  try {

    const { id } = req.params

    if (id) await pool.query('DELETE FROM `users` WHERE id_usuario = ?', [id])

    res.sendStatus(200);

  } catch (error) {

    res.sendStatus(500);

  }

}

module.exports = { getUsuarios, createUsuario, borrarUsuario, actualizarUsuario, actualizarContraseña }