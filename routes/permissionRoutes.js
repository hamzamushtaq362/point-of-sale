const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const addRolePermission = require("../controller/rolePermission");
const auth = require("../middleware/Authentication");
const middleware = require("../middleware/Middleware");


router.post(
    "/addRolePermission",
    // auth.auth,
    addRolePermission.addRolePermission
  );
  

  module.exports = router;