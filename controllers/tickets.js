/*
Importacion de modulos
*/
const pool = require('../database/configdb');
const { getTicketsBd, getTicketData, getNumTickets, createTicketBd, updateTicketBd, deleteTicketBd } = require('../utils/dbCalls')

// GET
const getTickets = async (req, res) => {

  try {

    const desde = Number(req.query.desde) || 0;
    const registropp = 10;

    const [tickets, total] = await Promise.all([
      getTicketsBd(desde, registropp),
      getNumTickets()
    ]);

    res.status(200).send({
      ok: 200,
      msg: 'getTickets',
      tickets: tickets,
      page: {
        desde,
        registropp,
        total
      }
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error getting tickets"
    });

  }

}

const getTicket = async (req, res) => {

  try {

    const { id } = req.params
    const ticket = await getTicketData(id)

    res.status(200).send({
      ok: 200,
      msg: 'getTickets',
      ticket: ticket
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error getting ticket"
    });

  }

}

// POST
const createTicket = async (req, res) => {

  try {

    const data = req.body

    const post = await createTicketBd(data)
    res.status(200).send({
      ok: 200,
      msg: "Ticket created successfully"
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error creating ticket: " + error
    });

  }

}

// PUT
const updateTicket = async (req, res) => {

  try {

    const { id } = req.params
    const data = req.body

    const post = await updateTicketBd(data, id)
    res.status(200).send({
      ok: 200,
      msg: "Ticket updated successfully"
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error updating ticket: " + error
    });

  }

}


// DELETE
const deleteTicket = async (req, res) => {

  try {

    const { id } = req.params

    await deleteTicketBd(id)

    return res.status(200).send({
      ok: 200,
      msg: "Ticket deleted successfully"
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error deleting ticket: " + error
    });

  }

}

module.exports = { getTickets, getTicket, createTicket, deleteTicket, updateTicket }