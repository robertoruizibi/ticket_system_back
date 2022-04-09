/*
Importacion de modulos
*/
const pool = require('../database/configdb');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

// GET
const enviarArchivo = async (req, res) => {

  try {

    res.status(200).send({
      ok: 200,
      msg: 'File served succesfully',
    });

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
      ficheroReporte: ['doc', 'docx', 'xls', 'pdf', 'zip', 'jpeg', 'jpg', 'png']
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

    const uploadPath = `${process.env.PATHUPLOAD}/${tipo}/${uuidv4()}.${extension}`

    archivo.mv(uploadPath, (err) => {
      if (err) {
        return res.status(400).send({
          ok: 400,
          msg: `File could not be loaded`,
          type: tipo
        });
      }

      res.status(200).send({
        ok: 200,
        msg: "File uploaded succesfully"
      });
    });

  } catch (error) {

    res.status(500).send({
      errorCode: 500,
      errorMsg: "Error uploading file: " + error
    });

  }

}


module.exports = { enviarArchivo, subirArchivo }