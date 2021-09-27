const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

//config environmental variable
dotenv.config();

const productsRoute = require("./api/routes/products");
const ordersRoute = require("./api/routes/orders");
const userRoute = require("./api/routes/user");

//connect to MongoDB
mongoose.connect(
  `mongodb+srv://Admin:admin132@clusterfornodebackend.silgx.mongodb.net/taskmanager?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
  }
);

//morgan
app.use(morgan("dev"));

//making upload folder publicly available
app.use("/upload", express.static("upload"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//handling CORS error for browsers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization "
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, PATCH, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productsRoute);
app.use("/orders", ordersRoute);
app.use("/users", userRoute);

// app.use("/", (req, res, next) => {
//   res.status(200).send("<h1> Server is running </h1>");
// });

//handle 404 not found error
app.use((req, res, next) => {
  const error = new Error("Not Found Error");
  error.status = 404;
  next(error);
});

//handling errors other than 404 like internal server error
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
