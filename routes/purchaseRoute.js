const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const purchaseController = require("../controller/purchaseController");
const auth = require("../middleware/Authentication");
const middleware = require("../middleware/Middleware");
const purchaseSummaryController = require("../controller/purchaseSummary");

router.post(
  "/addpurchase",
  auth.auth,
  middleware.Middleware,
  purchaseController.purchaseAdd
);

router.delete(
  "/deletepurchase/:id",
  auth.auth,
  middleware.Middleware,
  purchaseController.deletePurchase
);

router.put(
  "/updatepurchase",
  auth.auth,
  middleware.Middleware,
  purchaseController.updatePurchase
);
router.get(
  "/showpurchase",
  auth.auth,
  middleware.Middleware,
  purchaseController.showPurchase
);
router.get(
  "/getSingleProduct/:id",
  auth.auth,
  middleware.Middleware,
  purchaseController.getSingleProduct
);

// router.get(
//   "/getSingleProduct/:id",
//   // purchaseMiddleware.viewAuthorizationPurchase,
//   purchaseController.getSingleProduct
// );

router.get(
  "/purchasesummary",
  auth.auth,
  middleware.Middleware,
  purchaseSummaryController.findPurchaseSummary
);
module.exports = router;
