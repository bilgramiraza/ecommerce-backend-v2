const Category = require('../models/category');
const Product = require('../models/product');

exports.getCategoryList = async (req,res,next)=>{
  try{
    const categories = await Category.find({}).select('name').lean().sort({name:1}).exec();
    if(!categories?.length){
      const err = new Error('categories not found');
      err.status = 404;
      return next(err);
    }
    req.categoryList = categories;
    return next();
  }catch(err){
    return next(err);
  }
};

exports.getProductList = async (req, res, next)=>{
  try{
    const categoryProducts = await Product.find({category:req.params.id}).select('name').lean().sort({name:1}).exec();
    const products =  categoryProducts.map((product)=>{
      const url = `/inventory/product/${product._id}`;
      return {
        name:product.name,
        url,
        deleteUrl:`${url}/delete`,
        updateUrl:`${url}/update`,
       };
    });
    req.productList = [...products];
    return next();
  }catch(err){
    return next(err);
  }
};
