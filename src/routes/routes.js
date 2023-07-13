"use strict";
const { Router } = require("express");
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary");
const fs = require("fs");
require("dotenv").config();

const diskStorage = multer.diskStorage({
  destination: path.join(__dirname, "../public/images"),
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const { hashcode, getVarphi, tolerance } = require("./optimaldisc.js");

const logger = require("./getinfo.js");

const uploads = multer({ storage: diskStorage });

const connect = require(path.join(__dirname, "..", "database.js"));

const routes = Router();

routes.post("/login", (req, resp) => {
  const { email, points } = req.body;
  const obj_points = JSON.parse(points);
  connect.query(
    `SELECT phi , passpoint , usuario
  FROM Usuario WHERE correo='${email}';`,
    (err, results, fields) => {
      if (err) {
        resp.send({
          accesstoken: undefined,
          error: "usuario o contrasena incorrectos",
        });
      }
      const varphi = JSON.parse(results[0].phi);
      const passpoint = results[0].passpoint;
      if (passpoint == hashcode(obj_points, varphi)) {
        const accessToken = logger.get_accesstoken({
          email,
          usuario: results[0].usuario,
        });
        resp.send({
          accesstoken: accessToken,
          error: "",
        });
      } else {
        resp.send({
          accesstoken: undefined,
          error: " contrasena incorrecta",
        });
      }
    },
  );
});

routes.post("/singup", uploads.single("image"), async (req, resp) => {
  const { username, email, points, confirmation, _default } = req.body;
  const obj_points = JSON.parse(points);
  const obj_conf = JSON.parse(confirmation);

  if (!username || !email || !points || !confirmation) {
    resp.send({ accesstoken: undefined, error: "rellene todos los campos" });
    return;
  }

  const varphi = getVarphi(obj_points);
  const passcode = hashcode(obj_points, varphi);
  const lit_varphi = JSON.stringify(varphi);

  if (passcode != hashcode(obj_conf, varphi)) {
    resp.send({
      accesstoken: undefined,
      error: "las contrasenas no coinciden",
    });
    return;
  }
  let result = req.file.path;
  try {
    result = (await cloudinary.v2.uploader.upload(req.file.path)).url;
    fs.unlinkSync(req.file.path);
  } catch (err) {
    console.log(err);
    resp.send({
      accesstoken: undefined,
      error: "hubo un error guardando la imagen",
    });
    fs.unlinkSync(req.file.path);
    return;
  }
  const imagepath = (_default == "true") ? "/images/default.jpg" : result;
  connect.query(
    `SELECT correo
  FROM Usuario WHERE correo='${email}';`,
    (err, results, fields) => {
      if (err != null) {
        resp.send({
          accesstoken: undefined,
          error: "no se pudo conectar a la base de datos",
        });
      } else if (results.length > 0) {
        resp.send({
          accesstoken: undefined,
          error: "el usuario ya esta registrado",
        });
      } else {
        connect.query(
          `INSERT INTO Usuario (correo,usuario,passpoint,imagen,phi) 
          VALUES ('${email}','${username}','${passcode}','${imagepath}','${lit_varphi}');`,
          (err, results, fields) => {
            if (err) {
              console.log(err);
              return;
            }
            const accessToken = logger.get_accesstoken({ email, username });
            console.log("Access Token:", accessToken);
            resp.send({ accesstoken: accessToken, error: "none" });
          },
        );
      }
    },
  );
});

routes.get("/tolerance", (req, res) => {
  res.send({ tolerance });
});

module.exports = routes;
