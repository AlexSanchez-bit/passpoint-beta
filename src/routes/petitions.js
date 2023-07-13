"use strict";
const { Router } = require("express");
const path = require("path");
const multer = require("multer");

const diskStorage = multer.diskStorage({
  destination: path.join(__dirname, "../public/images"),
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const logger = require("./getinfo.js");

const uploads = multer({ storage: diskStorage });

const conection = require(path.join(__dirname, "..", "database.js"));

const routes = Router();

routes.get("/username/:accesstoken", (req, res) => {
  const { accesstoken } = req.params;
  const info = logger.verify(accesstoken);
  res.send(info);
});

routes.post("/savenote", (req, res) => {
  const { note, accesstoken } = req.body;
  const { email } = logger.verify(accesstoken);
  conection.query(
    `INSERT INTO Note (correo,nota) VALUES ("${email}","${note}");`,
    (err, response, data) => {
      if (err) res.send({ saved: false });
      res.send({
        saved: true,
        notes: [{ id: response.insertId, content: note }],
      });
    },
  );
});

routes.get("/allnotes/:at", (req, res) => {
  const { at } = req.params;
  const { email } = logger.verify(at);
  conection.query(
    `SELECT id,nota as content FROM Note WHERE correo = '${email}';`,
    (err, response, data) => {
      if (err) res.send({ saved: false });
      res.send({ notes: response });
    },
  );
});

//eliinar elementos <BS>DELETE FROM Note WHERE id BETWEEN 1 AND 2;
routes.get("/removeNote/:at/:id", (req, res) => {
  const { at, id } = req.params;
  const { email } = logger.verify(at);
  conection.query(
    `DELETE FROM Note WHERE id=${id} AND correo = '${email}';`,
    (err, response, data) => {
      if (err) {
        res.send(false);
      } else {
        res.send(true);
      }
    },
  );
});

module.exports = routes;
