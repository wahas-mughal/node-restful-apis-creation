const express = require("express");
const route = express.Router();
const checkAuth = require("../middleware/check-auth");

const productController = require("../Controller/product");

//image uploading using multer
const multer = require("multer");

//filter the image type
const fileFilter = function (req, file, callback) {
  if (file.mimetype === "image/png") {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./upload");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      new Date().toISOString().replace(/:/g, "-") + file.originalname
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

route.get("/");

route.post(
  "/",
  upload.single("productImage"),
  checkAuth,
  productController.create_product
);

route.get("/:productId", productController.get_single_product);

route.patch("/:productId", checkAuth, productController.update_product);

route.delete("/:productId", checkAuth, productController.delete_product);

module.exports = route;
