const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const controller = require("../controller/productdata");

// router.get("/salesdata",controller.sales);
// router.get("/productdata", controller.amount);

module.exports = router;
