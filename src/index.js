const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(require("./routes/routes.js"));
app.use(require("./routes/images_routes.js"));

app.use(express.static(path.join(__dirname, "public")));

app.listen(8080, () => {
  console.log("conexion iniciada en el puerto 8080");
});
