const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const auth = require("../middleware/Authentication");
const middleware = require("../middleware/Middleware");
const productController = require("../controller/products");
const productSummaryController = require("../controller/productSummary");
const productReview = require("../controller/productReview");
const newArrival = require("../controller/productNewArrival");
const barcode = require("../controller/barcode");
const uploadMiddleware= require("../middleware/upload.middleware");
const file= require("../controller/fileUpload");

router.post(
  "/addproduct",
  auth.auth,
  middleware.Middleware,
  productController.create
);
router.post(
  "/addproductimg",
  auth.auth,
  middleware.Middleware,
  productController.photo
);
router.post(
  "/delproductimg",
  auth.auth,
  middleware.Middleware,
  productController.deleteImg
);

router.get(
  "/productpage",
  auth.auth,
  middleware.Middleware,
  productController.ProductPagination
);
router.get(
  "/searchproduct",
  auth.auth,
  middleware.Middleware,
  productController.searchProductDetails
);

router.get(
  "/products",
  auth.auth,
  middleware.Middleware,
  productController.viewProducts
);
router.get(
  "/product/:id",
  auth.auth,
  middleware.Middleware,
  productController.viewone
);

router.delete(
  "/deleteProduct/:id/",
  auth.auth,
  middleware.Middleware,
  productController.deleteProduct
);

router.put(
  "/updateProduct/:id/",
  auth.auth,
  middleware.Middleware,
  productController.updateProduct
);

router.get(
  "/productcategory",
  auth.auth,
  middleware.Middleware,
  productController.productcategory
);
router.get(
  "/productcheck",
  auth.auth,
  middleware.Middleware,
  productController.check
);
router.get(
  "/productsummary",
  auth.auth,
  middleware.Middleware,
  productSummaryController.findProductSummary
);

router.get(
  "/productCount",
  // auth.auth,
  middleware.Middleware,
  productReview.productCount
);

router.get(
"/newArrival",
// auth.auth,
middleware.Middleware,
newArrival.newArrival,
)

router.post(
  "/barcodes",
  // auth.auth,
  middleware.Middleware,
  barcode.barcode
  )

// router.post(
// '/stats', 
// uploadMiddleware.single('uploaded_file'), 
// productController.upload
// );file

router.post(
'/stats', 
file.fileUp
);

module.exports = router;
