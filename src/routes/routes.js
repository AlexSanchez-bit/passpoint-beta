"use strict";
const { Router } = require("express");
const path = require("path");
const multer = require("multer");

const diskStorage = multer.diskStorage({
  destination: path.join(__dirname, "../public/images"),
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploads = multer({ storage: diskStorage });

const connect = require(path.join(__dirname, "..", "database.js"));

const tolerance = 20;

const routes = Router();

//connect.query(`SELECT * FROM user WHERE id=${id}`, (err, results, fields) => {
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

routes.post("/login", (req, resp) => {
  const { email, points } = req.body;
  const obj_points = JSON.parse(points);
  connect.query(
    `SELECT phi , passpoint
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
      console.log(passpoint, hashcode(obj_points, varphi));
      if (passpoint == hashcode(obj_points, varphi)) {
        resp.send({
          accesstoken: 123,
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

routes.post("/singup", uploads.single("image"), (req, resp) => {
  const { username, email, points, confirmation, _default } = req.body;
  const obj_points = JSON.parse(points);
  const obj_conf = JSON.parse(confirmation);

  if (!username || !email || !points || !confirmation) {
    resp.send({ accesstoken: undefined, error: "rellene todos los campos" });
    return;
  }

  const imagepath = (_default == "true")
    ? "/images/default.jpg"
    : "/images/" + (req.file.filename);
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
  connect.query(
    `SELECT correo
  FROM Usuario WHERE correo='${email}';`,
    (err, results, fields) => {
      if (err != null) {
        resp.send({
          accesstoken: passcode,
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
            resp.send({ accesstoken: 123, error: "none" });
          },
        );
      }
    },
  );
});

routes.get("/tolerance", (req, res) => {
  res.send({ tolerance });
});

function hashcode(points, _varphi) {
  let total_hash = "";
  for (let i = 0; i < points.length; i++) {
    total_hash += optimal_discretization(
      points[i][0],
      points[i][1],
      _varphi[i][0],
      _varphi[i][1],
    );
  }
  return (total_hash);
}

function getVarphi(points) {
  let return_array = new Array();
  for (let i = 0; i < points.length; i++) {
    const x = points[i][0];
    const y = points[i][1];

    let fi = (x % (2 * tolerance)) >= (tolerance)
      ? x % tolerance
      : (x % (2 * tolerance)) - tolerance;

    let fiy = (y % (2 * tolerance)) >= (tolerance)
      ? y % tolerance
      : (y % (2 * tolerance)) - tolerance;

    return_array.push([fi, fiy]);
  }
  return return_array;
}

function optimal_discretization(x, y, fi, fiy) {
  let hash = Math.floor((x - fi) / (2 * tolerance)).toString();
  hash += Math.floor((y - fiy) / (2 * tolerance)).toString();
  return hash;
}
module.exports = routes;
