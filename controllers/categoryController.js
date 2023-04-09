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

exports.categoryDetail = async (req, res, next) => {
  try{
    const [category, categoryProducts] = await Promise.all([
      Category.findById(req.params.id).select('name description').lean().exec(),
      Product.find({category:req.params.id}).select('name').lean().sort({name:1}).exec(),
    ]);

    if (!category) {
      const err = new Error('Category not Found');
      err.status = 404;
      return next(err);
    }
    
    const url = `/inventory/category/${category._id}`;
    category.deleteUrl = `${url}/delete`;
    category.updateUrl = `${url}/update`;

    const products =  categoryProducts.map((product)=>{
      const url = `/inventory/product/${product._id}`;
      return {
        name:product.name,
        url,
        deleteUrl:`${url}/delete`,
        updateUrl:`${url}/update`,
       };
    });

    res.render('categoryDetail',{
      category,
      products,
    });

  }catch(err){
    return next(err);
  }
};

exports.categoryCreateGet = (req, res, next) => {
  res.render('categoryForm', {type:'Creation'});
};

exports.categoryCreatePost = [
  body('name','Category name Required').trim().isLength({min:1}).escape(),
  body('description','Category description Required').trim().isLength({min:1}).escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      const errorArray = errors.array();
      const errorObject = Object.fromEntries(errorArray.map((error)=>[error.param,error.msg]));

      return res.render('categoryForm',{
        name: req.body.name,
        description: req.body.description,
        errors: errorObject,
      });
    }

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });
    try{
      const foundCategory = await Category.findOne({name: req.body.name}).exec();
      if(foundCategory)  return res.redirect(`/inventory/category/${foundCategory._id}`);

      await category.save();
      return res.redirect(`/inventory/category/${category._id}`);
    }catch(err){
      return next(err);
    }
  }
];

exports.categoryDeleteGet = async (req, res, next) => {
  try{
    const [category, categoryProducts] = await Promise.all([
      Category.findById(req.params.id).select('name description').lean().exec(),
      Product.find({category:req.params.id}).select('name').lean().sort({name:1}).exec(),
    ]);
    if(!category) return res.redirect('/inventory/categories');

    const products =  categoryProducts.map((product)=>{
      const url = `/inventory/product/${product._id}`;
      return {
        name:product.name,
        url,
        deleteUrl:`${url}/delete`,
        updateUrl:`${url}/update`,
       };
    });

    return res.render('categoryDelete',{
      category,
      products,
    });
  }catch(err){
    return next(err);
  }
};

exports.categoryDeletePost = async (req, res, next) => {
  try{
    const [category, categoryProducts] = await Promise.all([
      Category.findById(req.body.categoryId).lean().exec(),
      Product.find({category:req.body.categoryId}).select('name').lean().exec(),
    ]);

    if(!category) return res.redirect('/inventory/categories');

    if(categoryProducts?.length){
      const products =  categoryProducts.map((product)=>{
        const url = `/inventory/product/${product._id}`;
        return {
          name:product.name,
          url,
          deleteUrl:`${url}/delete`,
          updateUrl:`${url}/update`,
         };
      });
  
      return res.render('categoryDelete',{
        category,
        products,
      });
    }
    await Category.findByIdAndDelete(req.body.categoryId);
    return res.redirect('/inventory/categories');
  }catch(err){
    return next(err);
  }
};

exports.categoryUpdateGet = (req, res, next) => {
  res.send('NOT IMPLEMENTED: category Update GET');
};

exports.categoryUpdatePost = (req, res, next) => {
  res.send('NOT IMPLEMENTED: category Update POST');
};
