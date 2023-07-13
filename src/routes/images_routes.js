"use strict";
const { Router } = require("express");
const path = require("path");
const routes = Router();
const connect = require(path.join(__dirname, "..", "database.js"));
require("dotenv").config();

routes.get("/default_img", (req, res) => {
  const default_ = process.env.DEF_IMG;
  res.send(JSON.stringify(default_));
});

routes.get("/usrimg/:usr", (req, res) => {
  const { usr } = req.params;
  connect.query(
    `SELECT imagen
  FROM Usuario WHERE correo='${usr}';`,
    (err, results, fields) => {
      if (err) {
        res.send();
        return;
      }
      res.send(results);
    },
  );
});

module.exports = routes;
