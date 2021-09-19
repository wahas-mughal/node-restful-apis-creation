const Order = require("../models/order");
const Product = require("../models/products");

exports.get_all_orders = (req, res, next) => {
  Order.find()
    .populate("product", "name")
    .exec()
    .then((doc) => {
      res.status(200).json({
        count: doc.length,
        orders: doc.map((docs) => {
          return {
            _id: docs._id,
            productId: docs.product,
            quantity: docs.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + docs._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });

  // res.status(200).json({
  //   message: "Orders fetched!",
  // });
};

exports.create_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          meessge: "Product not found.",
        });
      }
      const order = new Order({
        product: req.body.productId,
        quantity: req.body.quantity,
      });
      return order.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Order created successfully!",
        orderCreated: {
          orderId: result._id,
          productId: result.product,
          quantity: result.quantity,
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });

  // const order = {
  //   productId: req.body.productId,
  //   quantity: req.body.quantity,
  // };

  // res.status(201).json({
  //   message: "Order has been created!",
  //   order: order,
  // });
};

exports.get_single_order = (req, res, next) => {
  Order.findById(req.params.orderId)
    .select("product quantity _id")
    .populate("product")
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          desc: "GET ALL ORDERS",
          url: "http://localhost:3000/orders",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.delete_order = (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .then((result) => {
      res.status(200).json({
        message: "Order is deleted!",
        request: {
          type: "POST",
          desc: "CREATE AN ORDER",
          body: { productId: "ObjectID", quantity: "Number" },
          url: "http://localhost:3000/orders",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
