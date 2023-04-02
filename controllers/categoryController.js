const { body, validationResult } = require('express-validator');

//Only have to implement this function once per project
exports.index = (req, res, next) => {
  res.send('NOT IMPLEMENTED: Site Home Page');
};

exports.categoryList = (req, res, next) => {
  res.send('NOT IMPLEMENTED: category List');
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
