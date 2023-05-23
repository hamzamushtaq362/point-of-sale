const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const Role = require("../controller/rolePermission");


router.get(
    "/getRoles",
    Role.getRoles
  );
  

  module.exports = router;