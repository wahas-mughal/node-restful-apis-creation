const express = require("express");
const route = express.Router();
const checkAuth = require("../middleware/check-auth");
const orderController = require("../Controller/order");

const Order = require("../models/order");
const Product = require("../models/products");

route.get("/", checkAuth, orderController.get_all_orders);

route.post("/", checkAuth, orderController.create_order);

route.get("/:orderId", checkAuth, orderController.get_single_order);

route.delete("/:orderId", checkAuth, orderController.delete_order);

module.exports = route;
