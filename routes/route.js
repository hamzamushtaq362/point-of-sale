const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const controller = require("../controller/controller");

// const middleware = require('../middleware/auth');
// const control= require("../controller/data");
// const mdware = require("../middleware/authorize");
const exp = require("../controller/Expense");

const forgotPass = require("../controller/forgotpassword");
const controllerSupplier = require("../controller/supplierController");
const control = require("../controller/data");
const storeController = require("../controller/store");
const employeeauth = require("../controller/employee");
const adminAuth = require("../controller/superAdmin");
const notify = require("../controller/notification");
const updateEmployee = require("../controller/updateEmployee");
// const empMiddleware = require("../middleware/empMiddleware");
const countriesList = require("../controller/countries");

const auth = require("../middleware/Authentication");
const middleware = require("../middleware/Middleware");
const suppSummary = require("../controller/supplierSummary");
const countrySeeder= require("../controller/countries.seeder");
const categorySeeder= require("../controller/product_category.seeder");
const expenseSeeder= require("../controller/expense.seeder");


// Add User/Admin
router.post(
  "/users",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  controller.users
);

router.get("/getCountriesList", countriesList.country);

router.post("/login", controller.login);
router.get("/finduser", auth.auth, controller.findUser);
router.post("/verifyEmail", forgotPass.verifyEmail);
router.put("/forgetPassword/:id", forgotPass.newPassword);
router.get("/registrationData", control.getData);
router.put("/update/:id", control.update);
router.put("/decline/:id", control.decline);
router.post("/sorting", control.sorting);
router.post(
  "/addStore",
  auth.auth,
  middleware.Middleware,
  storeController.addStore
);
router.get(
  "/getStore",
  auth.auth,
  middleware.Middleware,
  storeController.getStore
);
router.get(
  "/getStore/:id",
  auth.auth,
  middleware.Middleware,
  storeController.getSingleStore
);
router.delete(
  "/getStore/:id",
  auth.auth,
  middleware.Middleware,
  storeController.deleteSingleStore
);

router.delete(
  "/deleteEmployee/:id/",
  auth.auth,
  middleware.Middleware,
  employeeauth.deleteEmployee
);
router.post(
  "/addEmployee",
  auth.auth,
  middleware.Middleware,
  controller.employeeAdd
);
router.get(
  "/viewEmployee",
  auth.auth,
  middleware.Middleware,
  employeeauth.viewemployee
);
router.put(
  "/updateEmployee/:id",
  auth.auth,
  middleware.Middleware,
  updateEmployee.updateEmployee
);
router.get("/searchemployee", auth.auth, middleware.Middleware, control.search);

router.get(
  "/employeepagination",
  auth.auth,
  middleware.Middleware,
  employeeauth.employeePagination
);

// Super Admin

router.post("/Slogin", adminAuth.superAdlogin);
router.get("/Slogin", adminAuth.login);
router.post("/create", adminAuth.create);
router.put("/changepassword/:id", adminAuth.changepassword);

router.get(
  "/productnotifictaion",
  auth.auth,
  middleware.Middleware,
  notify.productnotification
);
router.put(
  "/productstatus/:id",
  auth.auth,
  middleware.Middleware,
  notify.checknotification
);
router.get(
  "/markallnotification",
  auth.auth,
  middleware.Middleware,
  notify.markallnotification
);

//expense routes

router.post("/createExp", auth.auth, middleware.Middleware, exp.createExp);

router.get("/getExp", auth.auth, middleware.Middleware, exp.getExp);
router.delete(
  "/deleteExp/:id",
  auth.auth,
  middleware.Middleware,
  exp.deleteExp
);

router.post(
  "/getSingleExp",
  auth.auth,
  middleware.Middleware,
  exp.getSingleStoreExp
);

router.get("/getUser", auth.auth, middleware.Middleware);

router.put("/updateExp/:id", auth.auth, middleware.Middleware, exp.updateExp);

router.get("/searchexp", exp.search);

router.get("/categories", auth.auth, middleware.Middleware, exp.expCategories);

//Seed countries in DB
router.get(
  "/seedcountries",
  // auth.auth,
  // middleware.Middleware,
  countrySeeder.countriesSeeder
);

//Seed categories in DB
router.get(
  "/seedCategory",
  categorySeeder.categorySeeder
);

//Seed expense in DB
router.get(
  "/seedExpense",
  expenseSeeder.expenseSeeder
);

router.post(
  "/adminSignup",
  controller.signup
);


module.exports = router;
