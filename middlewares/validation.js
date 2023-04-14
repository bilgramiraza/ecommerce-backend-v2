const {body, check, validationResult} = require('express-validator');
const { unlink } = require('node:fs/promises');
const multerMiddleware = require('./multerMiddleware');
const Product = require('../models/product');

function validationObject(req,res,next){
  //Creates an ErrorHandling Object in the format of 
  //{[param]:[msg],...}
  //Where 'param' is the input name which failed validation and 'msg' is the Error Message generated for it
  const errorObject = validationResult(req).formatWith(({ msg }) => msg).mapped();
  if(Object.keys(errorObject).length>0) req.errorObject = errorObject;
  return next();
}

const multerValidation = (inputField, minCount)=>{
  return check(inputField).custom((value, {req})=>{
    const files = req?.files[inputField];
    if(!files || !files.length){ 
      throw new Error(`No ${inputField} uploaded. Only PNG/JPG/JPEG images Allowed.`);
    }
    if(files.length < minCount){
      throw new Error(`Please Upload atleast ${minCount} ${inputField}.`);
    }
    return true;
  })
}

async function multerCleanup(req,res,next) {
  try{
    if (Object.keys(req?.errorObject).length>0 && req?.files) {
      const promises = [];
      const { productImage, descriptionImages } = req.files;
      if (productImage) {
        promises.push(unlink(productImage[0].path));
      }
      if (descriptionImages) {
        if(Array.isArray(descriptionImages)){
          promises.push(
            ...descriptionImages.map((file) => {
              return unlink(file.path);
            })
          );
        }else{
          promises.push(unlink(descriptionImages.path));
        }
      }
      await Promise.all(promises);
      req.errorObject.img = true;
    }
    return next();
  }catch(err){
    return next(err);
  }
};

const duplicateNameCheck = async (value)=>{
  const foundProduct = await Product.exists({name:value});
  if(foundProduct)  return Promise.reject(`Product with Name ${value} already Exists`);
  return true;
};

exports.productValidation = [
  body('name','Product Name Cannot be Empty').trim().isLength({min:1}).escape().custom(duplicateNameCheck),
  body('description','Product Description Cannot be Empty').trim().isLength({min:1}).escape(),
  body('sku','Product SKU Cannot be Empty').trim().isLength({min:1}).escape(),
  body('category','Product Category Must be Selected').trim().isLength({min:1}).escape(),
  body('quantity','Product Quantity cannot be Empty').isInt({gt:0}).withMessage('Product Quantity must be Positive'),
  body('price','Product Price cannot be Empty').isFloat({gt:0}).withMessage('Product Price must be Positive'),
  multerMiddleware.fields([
    { name: 'productImage', maxCount:1},
    { name: 'descriptionImages', maxCount:5},
  ]),
  multerValidation('productImage',1),
  multerValidation('descriptionImages',2),
  validationObject,
  multerCleanup,
];

exports.categoryValidation = [
  body('name','Category name Required').trim().isLength({min:1}).escape(),
  body('description','Category description Required').trim().isLength({min:1}).escape(),
  validationObject,
];
