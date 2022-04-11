/*
Importacion de modulos
*/
const pool = require('../database/configdb');
const { getDatesBd, getNumDates, getDateData, createDateBd, deleteDateBd, updateDatetBd } = require('../utils/dbCalls')

// GET
const getDates = async (req, res) => {

  try {

    const desde = Number(req.query.desde) || 0;
    const registropp = 10;
    const [dates, total] = await Promise.all([
      getDatesBd(desde, registropp),
      getNumDates()
    ]);

    res.status(200).send({
      ok: 200,
      msg: 'getDates',
      dates: dates,
      page: {
        desde,
        registropp,
        total
      }
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error getting dates"
    });

  }

}

const getDate = async (req, res) => {

  try {

    const { id } = req.params
    const date = await getDateData(id)

    res.status(200).send({
      ok: 200,
      msg: 'getDate',
      date: date
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error getting date"
    });

  }

}

// POST
const createDate = async (req, res) => {

  try {

    const data = req.body

    const post = await createDateBd(data)
    res.status(200).send({
      ok: 200,
      msg: "Date created successfully"
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error creating user: " + error
    });

  }

}

// PUT
const updateDate = async (req, res) => {

  try {

    const { id } = req.params
    const data = req.body

    await updateDatetBd(data, id)

    res.status(200).send({
      ok: 200,
      msg: "Date updated successfully"
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error updating date: " + error
    });

  }

}


// DELETE
const deleteDate = async (req, res) => {

  try {

    const { id } = req.params

    await deleteDateBd(id)

    return res.status(200).send({
      ok: 200,
      msg: "Date deleted successfully"
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error deleting date: " + error
    });

  }

}

module.exports = { getDates, getDate, createDate, updateDate, deleteDate }