const express = require("express");
require("dotenv").config();
const bodyparser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

const port = process.env.PORT | 3000;

app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(require("./routes/routes.js"));
app.use(require("./routes/images_routes.js"));
app.use(require("./routes/petitions.js"));

app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`servidor iniciado en el puerto ${port}`);
});
