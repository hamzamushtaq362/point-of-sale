const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const controllerSupplier = require("../controller/supplierController");
const auth = require("../middleware/Authentication");
const middleware = require("../middleware/Middleware");
const supplierSummaryController = require("../controller/supplierSummary");

router.post(
  "/addSupplier",
  [body("email", "Enter a valid email").isEmail()],
  auth.auth,
  middleware.Middleware,
  controllerSupplier.addSupplier
);
router.delete(
  "/deleteSupplier/:id",
  auth.auth,
  middleware.Middleware,
  controllerSupplier.deleteSupplier
);

router.put(
  "/updatesupplier/:id",
  auth.auth,
  middleware.Middleware,
  controllerSupplier.updateSuppliers
);

router.get(
  "/searchsupplier",
  auth.auth,
  middleware.Middleware,
  controllerSupplier.searchSupplierDetails
);

router.get(
  "/supplierinfo",
  auth.auth,
  middleware.Middleware,
  controllerSupplier.showSuppliers
);

router.get(
  "/showcountries",
  auth.auth,
  middleware.Middleware,
  controllerSupplier.countriesCollection
);

router.get(
  "/suppliersummary",
  auth.auth,
  middleware.Middleware,
  supplierSummaryController.findSupplierSummary
);

module.exports = router;
