const jwt_decode = require("jwt-decode");
const roleModel = require('./../models/role');

exports.auth = async function (req, res, next) {
  try {
    const token = req.headers.authorization;
    console.log(token);
    if (typeof token !== "undefined") {
      const firstToken = token.split('.');
      console.log('firstToken',firstToken);

      // const last = firstToken[0];
      // console.log('last', last);
      
      var decoded = jwt_decode(token);
      console.log('decoded',decoded);

      // let permission = await roleModel
      // .findOne({ role_id: decoded.role_id }).populate({path:"permission_id"})
      // console.log(permission);
      // req.store = decoded.store_id;
      // console.log(req.store);
      // req.access = permission.permission_id;

      req.user = decoded.email;
        if (decoded) {
        // console.log('hellpsssssso')

        next();
      }
    } else {
      return res.status(401).json({
        message: "Token not found",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: "Not Found Token",
    });
  }
};
