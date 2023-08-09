const jwt = require("jsonwebtoken");

const secretKey = process.env.KEY; // La misma clave secreta utilizada para firmar el token
class logger {
  constructor() {
  }

  verify(accessToken) {
    try {
      const decoded = jwt.verify(accessToken, secretKey);
      return decoded;
    } catch (error) {
      return null;
    }
  }

  get_accesstoken(passcode) {
    return jwt.sign(passcode, secretKey, {});
  }
}

module.exports = new logger();
