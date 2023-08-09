const crypto = require("crypto");

// Definir clave secreta de 256 bits en hexadecimal
const secretKey256Hex = process.env.AES_KEY;
const secretKey256 = Buffer.from(secretKey256Hex, "hex");

// Definir vector de inicialización de 128 bits en hexadecimal
const iv128Hex = process.env.IV_128;
const iv128 = Buffer.from(iv128Hex, "hex");

const SECRET_KEY = secretKey256; // Clave secreta de 256 bits

function encryptObject(obj) {
  const cipher = crypto.createCipheriv("aes-256-cbc", SECRET_KEY, iv128);
  let encrypted = cipher.update(JSON.stringify(obj), "utf-8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decryptObject(encryptedData) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", SECRET_KEY, iv128);
  let decrypted = decipher.update(encryptedData, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return JSON.parse(decrypted);
}

module.exports = { encryptObject, decryptObject };
