const express = require("express");
const route = express.Router();
const checkAuth = require("../middleware/check-auth");
const userController = require("../Controller/user");

route.post("/signup", userController.signup);

route.post("/login", userController.login);

route.delete("/:uid", checkAuth, userController.delete_user);

module.exports = route;
