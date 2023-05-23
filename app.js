const express = require("express");
const helmet = require("helmet");
var cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// const corsOptions ={
//   origin:'https://trial.mobiscroll.com',
//   credentials:true,            //access-control-allow-credentials:true
//   optionSuccessStatus:200
// }
app.use(cors());
// const bodyParser = require("body-parser");
// const hello =require('./package.json');
// console.log(hello);

const bodyParser = require("body-parser");
const mainRoute = require("./routes/route");
const purchaseRoute = require("./routes/purchaseRoute");
const supplierRoute = require("./routes/supplierRoute");
const cashierroute = require("./routes/cashierRoutes");
const salesroute = require("./routes/salesdata");
const permissionRoute = require("./routes/permissionRoutes");
const roleRoutes = require("./routes/roleRoutes");
const productRoutes = require("./routes/productRoute");
const connectToMongo = require("./database");
const fileUpload = require("express-fileupload");
connectToMongo();
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Api is working perfectly.",
  });
});
const Port = 3000;
app.listen(Port, () => {
  console.log(`Port is active at localhost:${Port}`);
});

app.use(function (err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  return res.status(err.status || HTTP_SERVER_ERROR).render("500");
});

app.use(
  "/api",
  mainRoute,
  purchaseRoute,
  supplierRoute,
  cashierroute,
  salesroute,
  permissionRoute,
  roleRoutes,
  productRoutes,

  (req, res) => {
    res.status(404).json({
      success: false,
      message: "Page not found",
      error: {
        statusCode: 404,
        message: "You reached a route that is not defined on this server",
      },
    });
  }
);
// process.on("uncaughtException", function (error) {
//   errorManagement.handler.handleError(error);
//   if (!errorManagement.handler.isTrustedError(error)) process.exit(1);
// });

// process.on("unhandledRejection", function (reason, promise) {
//   console.log("Unhandled Rejection:", reason.stack);
//   process.exit(1);
// });

app.use(function (err, req, res, next) {
  // All errors from async & non-async route above will be handled here
  res.status(500).send(err.message);
});
