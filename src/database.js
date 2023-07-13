const mysql = require("mysql");
require("dotenv").config();

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const pass = process.env.DB_PASW;
const name = process.env.DB_NAME;

const conection = mysql.createConnection({
  host: host,
  database: name,
  user: user,
  password: pass,
  ssl: true,
});

conection.connect((err) => {
  if (err) {
    console.log("hubo un error de conexion" + err.stack);
    return;
  }
  console.log("conexion establecida " + conection.threadId);
});

conection.query(
  `CREATE TABLE IF NOT EXISTS Usuario (
  correo varchar(144) NOT NULL,
  usuario varchar(144) DEFAULT NULL,
  passpoint varchar(255) DEFAULT NULL,
  imagen varchar(255) DEFAULT NULL,
  phi varchar(255) DEFAULT NULL,
  PRIMARY KEY (correo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`,
  (err, response, data) => {
    if (err) console.log(err);
  },
);

conection.query(
  `CREATE TABLE IF NOT EXISTS Note (
  id bigint auto_increment,
  correo varchar(144) NOT NULL,
  nota varchar(10000) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`,
  (err, response, data) => {
    if (err) console.log(err);
  },
);

module.exports = conection;
