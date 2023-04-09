const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');

const {getCategoryList, getProductList} = require('../middlewares/generateLists');
const { productValidation, categoryValidation } = require('../middlewares/validation');


//Website HomePage
router.get('/', categoryController.index);

//PRODUCT ROUTES //
//product Creation Page
router.get('/product/create', getCategoryList, productController.productCreateGet);
router.post('/product/create', productValidation, getCategoryList, productController.productCreatePost);

//product Deletion Page
router.get('/product/:id/delete', productController.productDeleteGet);
router.post('/product/:id/delete', productController.productDeletePost);

//product Update Page
router.get('/product/:id/update', getCategoryList, productController.productUpdateGet);
router.post('/product/:id/update', productValidation, getCategoryList, productController.productUpdatePost);

//product Details Page
router.get('/product/:id', productController.productDetail);

//List All products
router.get('/products', productController.productList);

//CATEGORY ROUTES //

//Category Creation Page
router.get('/category/create', categoryController.categoryCreateGet);
router.post('/category/create', categoryValidation, categoryController.categoryCreatePost);

//Category Deletion Page
router.get('/category/:id/delete', getProductList, categoryController.categoryDeleteGet);
router.post('/category/:id/delete', getProductList, categoryController.categoryDeletePost);

//Category Update Page
router.get('/category/:id/update', categoryController.categoryUpdateGet);
router.post('/category/:id/update', categoryValidation, categoryController.categoryUpdatePost);

//Category Details Page
router.get('/category/:id', getProductList, categoryController.categoryDetail);

//List All Categories
router.get('/categories', categoryController.categoryList);

module.exports = router;
