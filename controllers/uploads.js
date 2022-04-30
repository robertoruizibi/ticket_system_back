/*
Importacion de modulos
*/
const pool = require('../database/configdb');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { updateBD } = require('../utils/dbCalls')
const fs = require('fs')

// GET
const enviarArchivo = async (req, res) => {

  try {

    const { 
      tipo, // fotoperfil, ficheroReporte
      fileName 
    } = req.params

    const path = `${process.env.PATHUPLOAD}/${tipo}`
    let uploadPath = `${path}/${fileName}`


    if (!fs.existsSync(uploadPath)) {
      if (tipo !== 'fotoPerfil') {
        return res.status(400).send({
          errorCode: 400,
          errorMsg: "File does not exist"
        });
      }
      uploadPath = `${path}/default-profile.jpg`;
    }

    res.sendFile(uploadPath)

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error serving file: " + error
    });

  }

}

// POST
const subirArchivo = async (req, res) => {

  try {

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({
        ok: 400,
        msg: "Error uploading file"
      });
    }

    if (req.files.archivo.truncated) {
      return res.status(400).send({
        ok: 400,
        msg: `File is too big, maximum size is ${process.env.MAXSIZEUPLOAD}MB`
      });
    }

    const { 
      tipo, // fotoperfil, ficheroReporte
      id 
    } = req.params

    const archivosVarios = {
      fotoPerfil: ['jpeg', 'jpg', 'png'],
      ficheroReporte: ['doc', 'docx', 'xls','xlsx', 'rar',  'pdf', 'zip', 'jpeg', 'jpg', 'png']
    }

    const archivo = req.files.archivo
    const nameSplitted = archivo.name.split('.')
    const extension = nameSplitted[nameSplitted.length-1]

    switch (tipo) {
      case 'fotoPerfil':
          if (!archivosVarios.fotoPerfil.includes(extension)){
            return res.status(400).send({
              ok: 400,
              msg: `This type of file '${extension}' is not allowed (${archivosVarios.fotoPerfil})`,
              type: tipo
            });
          }
        break;

      case 'ficheroReporte':
        if (!archivosVarios.ficheroReporte.includes(extension)){
          return res.status(400).send({
            ok: 400,
            msg: `This type of file '${extension}' is not allowed (${archivosVarios.ficheroReporte})`,
            type: tipo
          });
        }
        break;
    
      default:
          return res.status(400).send({
            ok: 400,
            msg: `This type of operation is not allowed`,
            type: tipo
          });
        break;
    }

    const path = `${process.env.PATHUPLOAD}/${tipo}`
    const fileName = `${uuidv4()}.${extension}`
    const uploadPath = `${path}/${fileName}`

    archivo.mv(uploadPath, (err) => {
      if (err) {
        return res.status(400).send({
          ok: 400,
          msg: `File could not be loaded`,
          type: tipo
        });
      }

      updateBD(tipo, path, fileName, id)
        .then(value => {
          if (!value) {
            fs.unlinkSync(uploadPath)
            return res.status(400).send({
              ok: 400,
              msg: `BD could not be updated`,
            });
          } else {
            res.status(200).send({
              ok: 200,
              msg: "File uploaded succesfully",
              fileName
            });
          }
        }).catch(error => {
          fs.unlinkSync(uploadPath)
          return res.status(400).send({
            ok: 400,
            msg: `Error loading file`,
          });
        })
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error uploading file: " + error
    });

  }

}

const deleteFile = async (req, res) => {

  try {

    const { 
      tipo, // fotoperfil, ficheroReporte
      fileName 
    } = req.params

    const path = `${process.env.PATHUPLOAD}/${tipo}`
    let uploadPath = `${path}/${fileName}`


    if (!fs.existsSync(uploadPath)) {
      return res.status(400).send({
        errorCode: 400,
        errorMsg: "File does not exist"
      });
    }

    fs.unlinkSync(uploadPath)

    res.status(200).send({
      ok: 200,
      msg: "File deleted succesfully",
      fileName
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error serving file: " + error
    });

  }

}


module.exports = { enviarArchivo, subirArchivo, deleteFile }