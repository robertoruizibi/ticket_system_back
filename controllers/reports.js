/*
Importacion de modulos
*/
const pool = require('../database/configdb');
const { getAllReportsBd, getNumReportsAll, getReportsBd, getNumReports, getReportData, createReportBd, updateReportBd, deleteReportBd, deleteAllReportsFromTicketBd, deleteFileBd } = require('../utils/dbCalls')
const { queryResultToObject } = require('../utils/common')

// GET
const getAllReports = async (req, res) => {

  try {

    const { id } = req.params
    const desde = Number(req.query.desde) || 0;
    const registropp = 10;
    const [reports, total] = await Promise.all([
      getAllReportsBd(desde, registropp),
      getNumReportsAll(id)
    ]);

    res.status(200).send({
      ok: 200,
      msg: 'getReports',
      reports: reports,
      page: {
        desde,
        registropp,
        total
      }
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error getting reports: " + error
    });

  }

}

const getReports = async (req, res) => {

  try {

    const { id } = req.params
    const desde = Number(req.query.desde) || 0;
    const registropp = 10;
    const [reports, total] = await Promise.all([
      getReportsBd(id, desde, registropp),
      getNumReports(id)
    ]);

    res.status(200).send({
      ok: 200,
      msg: 'getReports',
      reports: reports,
      page: {
        desde,
        registropp,
        total
      }
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error getting reports: " + error
    });

  }

}

const getReport = async (req, res) => {

  try {

    const { id } = req.params
    const report = await getReportData(id)

    res.status(200).send({
      ok: 200,
      msg: 'getReport',
      report: report
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error getting report: " + error
    });

  }

}

// POST
const createReport = async (req, res) => {

  try {

    const data = req.body

    const report = await createReportBd(data)
    res.status(200).send({
      ok: 200,
      msg: "Report created successfully",
      report: report.pop()
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error creating report: " + error
    });

  }

}

// PUT
const updateReport = async (req, res) => {

  try {

    const { id } = req.params
    const data = req.body

    const report = await updateReportBd(data, id)

    res.status(200).send({
      ok: 200,
      msg: "Report updated successfully",
      report: report[0]
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error updating report: " + error
    });

  }

}

// PUT
const actualizarContrase??a = async (req, res) => {

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
const deleteReport = async (req, res) => {

  try {

    const { id } = req.params

    const reports = await getReportData(id)
    if (reports.archivo_adjunto !== '') {
      await deleteFileBd(reports.archivo_adjunto, process.env.PROFILE_REPORT_TYPE, id)
    }

    await deleteReportBd(id)

    return res.status(200).send({
      ok: 200,
      msg: "Report deleted successfully"
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error deleting report: " + error
    });

  }

}

const deleteAllReportsFromTicket = async (req, res) => {

  try {

    const { id } = req.params

    const reports = await getReportsBd(id)
    reports.forEach(async report => {
      await deleteFileBd(report.archivo_adjunto, process.env.PROFILE_REPORT_TYPE, report.id_reporte)
    });

    // await deleteAllReportsFromTicketBd(id)

    return res.status(200).send({
      ok: 200,
      msg: "All reports were deleted successfully"
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error deleting reports from ticket"
    });

  }

}

module.exports = { getAllReports, getReports, getReport, createReport, deleteReport, updateReport, deleteAllReportsFromTicket }