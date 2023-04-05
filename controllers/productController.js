const Category = require('../models/category');
const Product = require('../models/product');
const { body, validationResult } = require('express-validator');

exports.productList = async (req, res, next) => {
  try{
    const productNameList = await Product.find({}).select('name').lean().sort({name:1}).exec();
    const products= productNameList.map((product)=>{
      return {
        name:product.name,
        url:`/inventory/product/${product._id}`,
      }
    });
    res.render('productList',{
      products,
    });
  }catch(err){
    return next(err);
  }
};

exports.productDetail = async (req, res, next) => {
  try{
    const product = await Product.findById(req.params.id).populate('category', 'name').lean().exec();
    if(!product){
      const err = new Error('Product Not Found');
      err.status = 404;
      return next(err);
    }
    const url = `/inventory/product/${product._id}`;
    product.deleteUrl = `${url}/delete`;
    product.updateUrl = `${url}/update`;
    product.category.url = `/inventory/category/${product.category?._id}`;
    res.render('productDetail',{
      product,
    });
  }catch(err){
    return next(err);
  }
};

exports.productCreateGet = (req, res, next) => {
  res.send('NOT IMPLEMENTED: product Create GET');
};

exports.productCreatePost = (req, res, next) => {
  res.send('NOT IMPLEMENTED: product Create POST');
};

exports.productDeleteGet = (req, res, next) => {
  res.send('NOT IMPLEMENTED: product Delete GET');
};

exports.productDeletePost = (req, res, next) => {
  res.send('NOT IMPLEMENTED: product Delete POST');
};

exports.productUpdateGet = (req, res, next) => {
  res.send('NOT IMPLEMENTED: product Update GET');
};

exports.productUpdatePost = (req, res, next) => {
  res.send('NOT IMPLEMENTED: product Update POST');
};
