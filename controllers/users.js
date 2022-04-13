/*
Importacion de modulos
*/
const pool = require('../database/configdb');
const { getUsers, getNumUsers, getUserData, createUser, updateUser, updatePassword, deleteUser, getTicketsFromCustomerUser, deleteDateBd, deleteAllReportsFromTicketBd, deleteTicketBd, deleteFileBd, getReportsBd } = require('../utils/dbCalls')
const { queryResultToObject } = require('../utils/common')

// GET
const getUsuarios = async (req, res) => {

  try {

    const desde = Number(req.query.desde) || 0;
    const registropp = 10;
    const [usuarios, total] = await Promise.all([
      getUsers(desde, registropp),
      getNumUsers()
    ]);

    res.status(200).send({
      ok: 200,
      msg: 'getUsuarios',
      usuarios: usuarios,
      page: {
        desde,
        registropp,
        total
      }
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
    const usuario = await getUserData(id)

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

    const userData = await getUserData(id)
    await deleteFileBd(userData.image, process.env.PROFILE_PHOTO_TYPE, id)

    let userTickets = await getTicketsFromCustomerUser(id)

    userTickets.forEach(async ticket => {
      let id = ticket.id_ticket
      const reports = await getReportsBd(id)
      reports.forEach(async report => {
        await deleteFileBd(report.archivo_adjunto, process.env.PROFILE_REPORT_TYPE, report.id_reporte)
      });
    });

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