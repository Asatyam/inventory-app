const Category = require('../models/category');
const Item = require('../models/item');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.item_detail = asyncHandler(async(req,res,next)=>{

    const item = await Item.findById(req.params.id).populate("category").exec();

    if(item === null){
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
    }

    res.render("item_detail",{
        title: item.name,
        item: item,
    });

});
exports.item_create_get = asyncHandler(async(req,res,next)=>{
    const categories = await Category.find().exec();

    res.render("item_form",{
        title: "Add item",
        categories:categories,
    });
});

exports.item_create_post = [


  body('name', 'Name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('category', 'Category must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('price', 'Price must not be empty').trim().escape(),
  body('available').escape(),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      available: req.body.available,
    });

    if (!errors.isEmpty()) {
     
     const categories = await Category.find().exec();

      res.render('item_form', {
        title: 'Add item',
        categories: categories,
        item: item,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save book.
      await item.save();
      res.redirect(item.url);
    }
  }),
];

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();
  if (item === null) {
    res.redirect('/');
  }
  res.render('item_delete', {
    title: 'Delete Item',
    item: item,
  });
});
exports.item_delete_post = asyncHandler(async (req, res, next) => {
 
    await Item.findByIdAndRemove(req.body.itemid);
    res.redirect('/');

});

exports.item_update_get = asyncHandler(async (req, res, next) => {

  const [item, categories] = await Promise.all([
    Item.findById(req.params.id).populate('category').exec(),
    Category.find(),
  ]);

  if (item === null) {
    // No results.
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }

  res.render('item_form', {
    title: 'Update Item',
    categories: categories,
    category: item.category._id,
    item: item,
  });
});

exports.item_update_post = [
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('category', 'Category must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('price', 'Price must not be empty').trim().escape(),
  body('available').escape(),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      available: req.body.available,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const categories = await Category.find().exec();

      res.render('item_form', {
        title: 'Update item',
        categories: categories,
        item: item,
        errors: errors.array(),
      });
    } else {
 
       const theitem = await Item.findByIdAndUpdate(req.params.id, item, {});
       res.redirect(theitem.url);
    }
  }),
];