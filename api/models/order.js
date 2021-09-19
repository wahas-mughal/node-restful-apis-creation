const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId, //joining the order model id to products model
    ref: "Products",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("Orders", orderSchema);
