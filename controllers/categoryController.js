const Category = require('../models/category');
const Product = require('../models/product');
const { body, validationResult } = require('express-validator');

//Only have to implement this function once per project
exports.index = async (req, res, next) => {
  try{
    const [categoryCount, productCount] = await Promise.all([
      Category.countDocuments({}).exec(),
      Product.countDocuments({}).exec(),
    ]);  
    res.render('index',{
      productCount,
      categoryCount,
    });
  }catch(err){
    return next(err);
  }
};

exports.categoryList = async (req, res, next) => {
  try{
    const categoryNameList = await Category.find({}).select('name').lean().sort({name:1}).exec();
    const categories = categoryNameList.map((category)=>{
      return {
        name:category.name,
        url:`/inventory/category/${category._id}`,
      }
    });
    res.render('categoryList',{
      categories,
    });
  }catch(err){
    return next(err);
  }
};

exports.categoryDetail = (req, res, next) => {
  res.send(`NOT IMPLEMENTED: category Detail ${req.params.id}`);
};

exports.categoryCreateGet = (req, res, next) => {
  res.send('NOT IMPLEMENTED: category Create GET');
};

exports.categoryCreatePost = (req, res, next) => {
  res.send('NOT IMPLEMENTED: category Create POST');
};

exports.categoryDeleteGet = (req, res, next) => {
  res.send('NOT IMPLEMENTED: category Delete GET');
};

exports.categoryDeletePost = (req, res, next) => {
  res.send('NOT IMPLEMENTED: category Delete POST');
};

exports.categoryUpdateGet = (req, res, next) => {
  res.send('NOT IMPLEMENTED: category Update GET');
};

exports.categoryUpdatePost = (req, res, next) => {
  res.send('NOT IMPLEMENTED: category Update POST');
};
