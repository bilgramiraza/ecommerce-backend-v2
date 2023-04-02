const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');

//PRODUCT ROUTES //
//Website HomePage
router.get('/', productController.index);

//product Creation Page
router.get('/product/create', productController.productCreateGet);
router.post('/product/create', productController.productCreatePost);

//product Deletion Page
router.get('/product/:id/delete', productController.productDeleteGet);
router.post('/product/:id/delete', productController.productDeletePost);

//product Update Page
router.get('/product/:id/update', productController.productUpdateGet);
router.post('/product/:id/update', productController.productUpdatePost);

//product Details Page
router.get('/product/:id', productController.productDetail);

//List All products
router.get('/products', productController.productList);

//CATEGORY ROUTES //
//Website HomePage
router.get('/', categoryController.index);

//Category Creation Page
router.get('/category/create', categoryController.categoryCreateGet);
router.post('/category/create', categoryController.categoryCreatePost);

//Category Deletion Page
router.get('/category/:id/delete', categoryController.categoryDeleteGet);
router.post('/category/:id/delete', categoryController.categoryDeletePost);

//Category Update Page
router.get('/category/:id/update', categoryController.categoryUpdateGet);
router.post('/category/:id/update', categoryController.categoryUpdatePost);

//Category Details Page
router.get('/category/:id', categoryController.categoryDetail);

//List All Categories
router.get('/categories', categoryController.categoryList);

module.exports = router;
