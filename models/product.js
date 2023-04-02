const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {type: String, maxlength: 100, required: true},
  description: {type: String, required: true},
  SKU: {type: String, required: true},
  category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
  quantity: {type: Number, min: 0, required: true},
  price: {type: Number, min: 0, required: true},
});

module.exports = mongoose.model('Product', ProductSchema);
