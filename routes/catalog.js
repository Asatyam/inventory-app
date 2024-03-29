const express = require('express');
const router = express.Router();
const category_controller = require('../controllers/categoryController')
const item_controller = require('../controllers/itemController');

router.get('/',category_controller.index);
router.get('/category/create',category_controller.category_create_get);
router.post('/category/create',category_controller.category_create_post);
router.get('/category/:id/delete',category_controller.category_delete_get);
router.post('/category/:id/delete',category_controller.category_delete_post);
router.get('/category/:id/update', category_controller.category_update_get);
router.post('/category/:id/update', category_controller.category_update_post);
router.get('/category/:id', category_controller.category_detail);

router.get('/item/create',item_controller.item_create_get);
router.post('/item/create',item_controller.item_create_post);
router.get('/items/:id/delete',item_controller.item_delete_get);
router.post('/items/:id/delete',item_controller.item_delete_post);
router.get('/items/:id/update', item_controller.item_update_get);
router.post('/items/:id/update', item_controller.item_update_post);

router.get('/items/:id', item_controller.item_detail);





module.exports = router;
