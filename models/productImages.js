  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;

  const productImagesSchema = new Schema({
    product: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
    productImage:{
      fileName: {type: String, required: true},
      path: {type: String, required: true},
      mimeType: {type: String, required: true},
    },
    descriptionImages:[
      {
        fileName: {type: String, required: true},
        path: {type: String, required: true},
        mimeType: {type: String, required: true},
      }
    ],
  });
  
  module.exports = mongoose.model('productImages', productImagesSchema);
