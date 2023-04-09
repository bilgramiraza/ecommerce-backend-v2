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
    product.category.url = `/inventory/category/${product.category._id}`;
    res.render('productDetail',{
      product,
    });
  }catch(err){
    return next(err);
  }
};

exports.productCreateGet = async (req, res, next) => {
  try{
    const categories = await Category.find({}).select('name').lean().sort({name:1}).exec();
    if(!categories?.length){
      const err = new Error('Categories Not Found');
      err.status = 404;
      return next(err);
    }
    return res.render('productForm', {
      type:'Creation',
      categories,
    });
  }catch(err){
    return next(err);
  }
};

exports.productCreatePost = [
  body('name','Product Name Cannot be Empty').trim().isLength({min:1}).escape(),
  body('description','Product Description Cannot be Empty').trim().isLength({min:1}).escape(),
  body('sku','Product SKU Cannot be Empty').trim().isLength({min:1}).escape(),
  body('category','Product Category Must be Selected').trim().isLength({min:1}).escape(),
  body('quantity','Product Quantity cannot be Empty').isInt({gt:0}).withMessage('Product Quantity must be Positive'),
  body('price','Product Price cannot be Empty').isFloat({gt:0}).withMessage('Product Price must be Positive'),
  async (req, res, next) => {
    try{
      //Creates an ErrorHandling Object in the format of 
      //{[param]:[msg],...}
      //Where 'param' is the input name which failed validation and 'msg' is the Error Message generated for it
      const errorObject = validationResult(req).formatWith(({ msg }) => msg).mapped();
      if(Object.keys(errorObject).length){ 
        const categories = await Category.find({}).select('name').lean().sort({name:1}).exec();
        if(!categories?.length){
          const err = new Error('No Categories found');
          err.status = 404;
          return next(err);
        }
        return res.render('productForm',{
          type:'Creation',
          ...req.body,
          categories,
          error:errorObject,
        });
      }

      const foundProduct = await Product.findOne({name:req.body.name}).select('_id').lean().exec();
      if(foundProduct)  return res.redirect(`/inventory/product/${foundProduct._id}`);

      const {name, description, sku:SKU, category, quantity, price} = req.body;
      const product = new Product({
        name,
        description, 
        SKU,
        category, 
        quantity, 
        price,
      }); 

      await product.save();
      return res.redirect(`/inventory/product/${product._id}`);
    }catch(err){
      return next(err);
    }
  },
];

exports.productDeleteGet = async (req, res, next) => {
  try{
    const product = await Product.findById(req.params.id).populate('category','name').lean().exec();

    if(!product) return res.redirect('/inventory/products');

    product.category.url = `/inventory/product/${product.category._id}`;
    return res.render('productDelete', {product});

  }catch(err){
    return next(err);
  }
};

exports.productDeletePost = async (req, res, next) => {
  try{
    const product = await Product.findByIdAndDelete(req.body.productId).lean().exec();
    
    return res.redirect('/inventory/products');
  }catch(err){
    return next(err);
  }
};

exports.productUpdateGet = async (req, res, next) => {
  try{
    const [product, categories] = await Promise.all([
      Product.findById(req.params.id).lean().exec(),
      Category.find({}).select('name').lean().sort({name:1}).exec(),
    ]);
    if(!product){
      const err = new Error('Product Not Found');
      err.status = 404;
      return next(err);
    }else if(!categories?.length){
      const err = new Error('Categories Not Found');
      err.status = 404;
      return next(err);
    }

    const {name, description, SKU:sku, category, quantity, price}=product;
    return res.render('productForm',{
      type:'Revision',
      name,
      description,
      sku,
      category:category.toString(),
      quantity,
      price,
      categories,
    });
  }catch(err){
    return next(err);
  }
};

exports.productUpdatePost = [
  body('name','Product Name Cannot be Empty').trim().isLength({min:1}).escape(),
  body('description','Product Description Cannot be Empty').trim().isLength({min:1}).escape(),
  body('sku','Product SKU Cannot be Empty').trim().isLength({min:1}).escape(),
  body('category','Product Category Must be Selected').trim().isLength({min:1}).escape(),
  body('quantity','Product Quantity cannot be Empty').isInt({gt:0}).withMessage('Product Quantity must be Positive'),
  body('price','Product Price cannot be Empty').isFloat({gt:0}).withMessage('Product Price must be Positive'),
  async (req, res, next) => {
    try{
      //Creates an ErrorHandling Object in the format of 
      //{[param]:[msg],...}
      //Where 'param' is the input name which failed validation and 'msg' is the Error Message generated for it
      const errorObject = validationResult(req).formatWith(({ msg }) => msg).mapped();
      if(Object.keys(errorObject).length){ 
        const categories = await Category.find({}).select('name').lean().sort({name:1}).exec();
        if(!categories?.length){
          const err = new Error('No Categories found');
          err.status = 404;
          return next(err);
        }
        return res.render('productForm',{
          type:'Revision',
          ...req.body,
          categories,
          error:errorObject,
        });
      }

      const {name, description, sku:SKU, category, quantity, price} = req.body;
      await Product.findByIdAndUpdate(
        req.params.id,
        {name, description, SKU, category, quantity, price},
        {new:true, lean:true}
      );
      return res.redirect(`/inventory/product/${req.params.id}`);
    }catch(err){
      return next(err);
    }
  }
];
