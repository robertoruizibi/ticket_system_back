/*
Importacion de modulos
*/
const pool = require('../database/configdb');
const { getUsers, getSignleUser, createUser, updateUser, updatePassword, deleteUser } = require('../utils/dbCalls')

// GET
const getUsuarios = async (req, res) => {

  try {

    const usuarios = await getUsers()

    res.status(200).send({
      ok: 200,
      msg: 'getUsuarios',
      usuarios: usuarios
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error getting users"
    });

  }

}

const getUsuario = async (req, res) => {

  try {

    const { id } = req.params
    const usuario = await getSignleUser(id)

    res.status(200).send({
      ok: 200,
      msg: 'getUsuario',
      usuarios: usuario
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error getting user"
    });

  }

}

// POST
const createUsuario = async (req, res) => {

  try {

    const data = req.body

    const post = await createUser(data)
    res.status(200).send({
      ok: 200,
      msg: "User created successfully"
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
    const data = req.body

    await updateUser(data, id)

    res.status(200).send({
      ok: 200,
      msg: "User updated successfully"
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
    const data = req.body

    await updatePassword(data, id)

    return res.status(200).send({
      ok: 200,
      msg: "Password updated successfully"
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error updating password: " + error
    });

  }

}

// DELETE
const borrarUsuario = async (req, res) => {

  try {

    const { id } = req.params

    await deleteUser(id)

    return res.status(200).send({
      ok: 200,
      msg: "User deleted successfully"
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error deleting user: " + error
    });

  }

}

module.exports = { getUsuarios, getUsuario, createUsuario, borrarUsuario, actualizarUsuario, actualizarContraseña }