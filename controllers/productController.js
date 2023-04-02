const { body, validationResult } = require('express-validator');

exports.productList = (req, res, next) => {
  res.send('NOT IMPLEMENTED: product List');
};

exports.productDetail = (req, res, next) => {
  res.send(`NOT IMPLEMENTED: product Detail ${req.params.id}`);
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
