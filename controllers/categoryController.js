const Category = require('../models/category');
const Product = require('../models/product');

//Only have to implement this function once per project
exports.index = async (req, res, next) => {
  try{
    const [categoryCount, productCount] = await Promise.all([
      Category.countDocuments({}).exec(),
      Product.countDocuments({}).exec(),
    ]);  
    const category = {
      count: categoryCount,
      listUrl: '/inventory/categories',
      addUrl: '/inventory/category/create',
    };
    const product = {
      count: productCount,
      listUrl: '/inventory/products',
      addUrl: '/inventory/product/create',
    };
    res.render('index',{
      product,
      category,
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
    const category = await Category.findById(req.params.id).select('name description').lean().exec();

    if (!category) {
      const err = new Error('Category not Found');
      err.status = 404;
      return next(err);
    }
    
    const url = `/inventory/category/${category._id}`;
    category.deleteUrl = `${url}/delete`;
    category.updateUrl = `${url}/update`;

    let data = req.productList;
    res.render('categoryDetail',{
      category,
      products:req.productList,
    });

  }catch(err){
    return next(err);
  }
};

exports.categoryCreateGet = (req, res, next) => {
  res.render('categoryForm', {type:'Creation'});
};

exports.categoryCreatePost = async (req, res, next) => {
  const {name, description} = req.body;
  if(req.errorObject){ 
    return res.render('categoryForm',{
      name,
      description,
      errors: req.errorObject,
    });
  }

  const category = new Category({
    name,
    description,
  });
  try{
    const foundCategory = await Category.findOne({name}).exec();
    if(foundCategory)  return res.redirect(`/inventory/category/${foundCategory._id}`);

    await category.save();
    return res.redirect(`/inventory/category/${category._id}`);
  }catch(err){
    return next(err);
  }
};

exports.categoryDeleteGet = async (req, res, next) => {
  try{
    const category = await Category.findById(req.params.id).select('name description').lean().exec();
    if(!category) return res.redirect('/inventory/categories');

    return res.render('categoryDelete',{
      category,
      products:req.productList,
    });
  }catch(err){
    return next(err);
  }
};

exports.categoryDeletePost = async (req, res, next) => {
  try{
    const category = await Category.findById(req.body.categoryId).lean().exec();

    if(!category) return res.redirect('/inventory/categories');

    if(req.productList?.length){
      return res.render('categoryDelete',{
        category,
        products:req.productList,
      });
    }
    await Category.findByIdAndDelete(req.body.categoryId);
    return res.redirect('/inventory/categories');
  }catch(err){
    return next(err);
  }
};

exports.categoryUpdateGet = async (req, res, next) => {
  try{
    const category = await Category.findById(req.params.id).lean().exec();

    if(!category){
      const err = new Error('Category Not Found');
      err.status = 404;
      return next(err);
    }

    return res.render('categoryForm',{
      type:'Revision',
      name:category.name,
      description:category.description,
    });
  }catch(err){
    return next(err);
  }
};

exports.categoryUpdatePost = async (req, res, next) => {
  const {name, description} = req.body;
  if(req.errorObject){ 
    return res.render('categoryForm',{
      type:'Revision',
      name,
      description,
      errors: req.errorObject,
    });
  }

  try{
    await Category.findByIdAndUpdate(req.params.id, {name, description},{new:true, lean:true});

    return res.redirect(`/inventory/category/${req.params.id}`);
  }catch(err){
    return next(err);
  }
};
