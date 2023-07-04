const mysql = require("mysql");

const conection = mysql.createConnection({
  host: "localhost",
  database: "passpoint",
  user: "root",
  password: "abc",
});

conection.connect((err) => {
  if (err) {
    console.log("hubo un error de conexion" + err.stack);
    return;
  }
  console.log("conexion establecida " + conection.threadId);
});

module.exports = conection;
