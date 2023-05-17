const express = require('express');
const router = express.Router();
const category_controller = require('../controllers/categoryController')

router.get('/',category_controller.index);
router.get('/category/create',category_controller.category_create_get);
router.post('/category/create',category_controller.category_create_post);
router.get('/category/:id/delete',category_controller.category_delete_get);
router.post('/category/:id/delete',category_controller.category_delete_post);




router.get('/category/:id',category_controller.category_detail);

module.exports = router;
