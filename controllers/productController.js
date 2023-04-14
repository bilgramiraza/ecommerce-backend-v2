const Category = require('../models/category');
const Product = require('../models/product');
const ProductImages = require('../models/productImages');

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
    return res.render('productForm', {
      type:'Creation',
      categories: req.categoryList,
    });
  }catch(err){
    return next(err);
  }
};

exports.productCreatePost = async (req, res, next) => {
  try{
    if(req.errorObject){ 
      return res.render('productform',{
        type:'creation',
        ...req.body,
        categories: req.categorylist,
        error:req.errorObject,
      });
    }

    //TODO: Move this to a ValidationMiddleware 
    const foundproduct = await product.findone({name:req.body.name}).select('_id').lean().exec();
    if(foundproduct)  return res.redirect(`/inventory/product/${foundproduct._id}`);
    
    const {name, description, sku:sku, category, quantity, price} = req.body;
 
    const {productImage, descriptionImages } = req.files;
    const prodImageObj = {
      fileName: productImage[0].filename,
      path: productImage[0].path,
      mimeType:productImage[0].mimetype,
    }; 
    const descImagesObj = descriptionImages.map(({filename, path, mimetype})=>{
      return {
        fileName:filename,
        path,
        mimeType:mimetype,
      };
    });

    const product = new product({
      name,
      description, 
      sku,
      category, 
      quantity, 
      price,
    }); 
    await product.save();
    
    const productImages = new ProductImages({
      product: product._id,
      productImage: prodImageObj,
      descriptionImages: descImagesObj,
    });
    await productImages.save();

    return res.redirect(`/inventory/product/${product._id}`);
  }catch(err){
    return next(err);
  }
};

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
    const product = await Product.findById(req.params.id).lean().exec();
    if(!product){
      const err = new Error('Product Not Found');
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
      categories:req.categoryList,
    });
  }catch(err){
    return next(err);
  }
};

exports.productUpdatePost = async (req, res, next) => {
  try{
    if(req.errorObject){ 
      return res.render('productForm',{
        type:'Revision',
        ...req.body,
        categories:req.categoryList,
        error:req.errorObject,
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
};
