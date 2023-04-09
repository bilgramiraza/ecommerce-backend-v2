const {body, validationResult} = require('express-validator');

function validationObject(req,res,next){
  //Creates an ErrorHandling Object in the format of 
  //{[param]:[msg],...}
  //Where 'param' is the input name which failed validation and 'msg' is the Error Message generated for it
  const errorObject = validationResult(req).formatWith(({ msg }) => msg).mapped();
  if(Object.keys(errorObject).length>0) req.errorObject = errorObject;
  return next();
}

exports.productValidation = [
  body('name','Product Name Cannot be Empty').trim().isLength({min:1}).escape(),
  body('description','Product Description Cannot be Empty').trim().isLength({min:1}).escape(),
  body('sku','Product SKU Cannot be Empty').trim().isLength({min:1}).escape(),
  body('category','Product Category Must be Selected').trim().isLength({min:1}).escape(),
  body('quantity','Product Quantity cannot be Empty').isInt({gt:0}).withMessage('Product Quantity must be Positive'),
  body('price','Product Price cannot be Empty').isFloat({gt:0}).withMessage('Product Price must be Positive'),
  validationObject,
];

exports.categoryValidation = [
  body('name','Category name Required').trim().isLength({min:1}).escape(),
  body('description','Category description Required').trim().isLength({min:1}).escape(),
  validationObject,
];
