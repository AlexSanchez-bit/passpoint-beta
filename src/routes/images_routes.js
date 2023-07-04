"use strict";
const { Router } = require("express");

const routes = Router();

routes.get("/usrimg/:user", (req, resp) => {
  const user = req.params;
  console.log(user);
});

routes.get("/default_img", (req, res) => {
  const default_ = "/images/default.jpg";
  res.send(JSON.stringify(default_));
});

module.exports = routes;
