const CryptoJS = require("crypto-js");
const key = require("../config");
exports.Middleware = function (req, res, next) {
  try {
    let cookies = req.headers.cookies;
    req.store = req.headers.store;
    // console.log("store in socket", req.store);
    // const bytes = CryptoJS.AES.decrypt(cookies, key.passphrase);
    // cookies = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    
    req.access = cookies;
    req.role = req.headers.role;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "You are not active",
    });
  }
};