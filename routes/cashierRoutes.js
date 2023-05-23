const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const cashierController = require("../controller/cashier");
const auth = require("../middleware/Authentication");
const middleware = require("../middleware/Middleware");
const salesSummaryController = require("../controller/salesSummary");

router.get(
  "/getOneProduct",
  auth.auth,
  middleware.Middleware,
  cashierController.searchProductDetails
);
router.put(
  "/updateQuantity",
  auth.auth,
  middleware.Middleware,
  cashierController.updateQTY
);
router.post(
  "/updateQuantityOnChange",

  cashierController.checkQTYOnChange
);
router.post(
  "/addSale",
  auth.auth,
  middleware.Middleware,
  cashierController.addSales
);
router.get(
  "/viewSale",
  auth.auth,
  middleware.Middleware,
  cashierController.showSellData
);
router.get(
  "/searchSales",
  auth.auth,
  middleware.Middleware,
  cashierController.searchSalesDetails
);

router.get(
  "/viewSale",
  auth.auth,
  middleware.Middleware,
  cashierController.showSellData
);

router.delete(
  "/deleteSale/:id",
  auth.auth,
  middleware.Middleware,
  cashierController.deleteSale
);
router.get("/totalsales", cashierController.totalSales);
router.get(
  "/searchSales",
  auth.auth,
  middleware.Middleware,
  cashierController.searchSalesDetails
);

router.put(
  "/updateSale",
  auth.auth,
  middleware.Middleware,
  cashierController.updateSaleQTY
);

router.delete(
  "/deleteSale/:id",
  auth.auth,
  middleware.Middleware,
  cashierController.deleteSale
);

router.get(
  "/salesgraph",
  auth.auth,
  middleware.Middleware,
  salesSummaryController.salesSummary
);
router.get(
  "/salesdetails",
  auth.auth,
  middleware.Middleware,
  cashierController.salesDetails
);
module.exports = router;
