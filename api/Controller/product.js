const Product = require("../models/products");

exports.get_all_products = (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then((docs) => {
      const response = {
        totalCount: docs.length,
        products: docs.map((doc) => {
          return {
            _id: doc._id,
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            request: {
              type: "GET",
              productUrl: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };

      if (docs.length > 0) {
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "No data found.",
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        error: err,
      });
    });

  // res.status(200).json({
  //   message: "products GET route.",
  // });
};

exports.create_product = (req, res, next) => {
  console.log(req.file);

  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });

  //save product in database
  product
    .save()
    .then((result) => {
      console.log("Product saved successfully.", result);
      res.status(201).json({
        message: "product created successfully!",
        product: {
          _id: result._id,
          name: result.name,
          price: result.price,
          productImage: result.productImage,
          request: {
            type: "GET",
            url: "http://localhost:3000/products" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });

  // const product = {
  //   name: req.body.name,
  //   price: req.body.price,
  // };
};

exports.get_single_product = (req, res, next) => {
  const id = req.params.productId;

  //query the database to return the product w.r.t passed product id
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/products",
          },
        });
      } else {
        res.status(404).json({
          message: "No valid entry found for the provided id.",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });

  // if (id === "special") {
  //   res.status(200).json({
  //     message: "Return special ID",
  //     id: id,
  //   });
  // } else {
  //   res.status(200).json({
  //     message: "No results found with this id",
  //     id: id,
  //   });
  // }
};

exports.update_product = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "product is updated!",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });

  // res.status(200).json({
  //   message: "product updated.",
  // });
};

exports.delete_product = (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product is deleted!",
        request: {
          type: "POST",
          desc: "Create product",
          url: "http://localhost:3000/products/",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });

  // res.status(200).json({
  //   message: "product deleted.",
  // });
};
