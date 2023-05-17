const Category = require('../models/category');
const Item = require('../models/item');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');


exports.index = asyncHandler(async(req,res,next)=>{

    const categories = await Category.find({},"name").sort({name:1}).exec();
    res.render("index",{categories_list:categories});

});

exports.category_create_get = asyncHandler(async (req,res,next)=>{
    res.render("category_form",{title:'Create Category'});
});
exports.category_create_post = [
    body('name',"Name must be specified")
    .trim()
    .isLength({min:1})
    .escape(),

    body('description',"Description must be given")
    .trim()
    .isLength({min:1})
    .escape()
    ,
    asyncHandler(async(req,res,next)=>{
        const errors = validationResult(req);
        const category = new Category({name:req.body.name, description:req.body.description});

        if(!errors.isEmpty()){
            res.render("category_form",{
                title:"Create Category",
                category:category,
                errors:errors.array(),
            });
            return;
        } else{
            const categoryExists = await Category.findOne({name:req.body.name}).exec();
            if(categoryExists){
                res.redirect(categoryExists.url);
            }else{
                await category.save();
                res.redirect('/');
            }
        }
    })
]

exports.category_delete_get = asyncHandler(async(req,res,next)=>{
    const [category,allItemsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({category: req.params.id},"name description").exec(),
    ]);
    if(category === null){
        res.redirect('/catalog/categories');
    }
    res.render("category_delete",{
        title:"Delete Category",
        category:category,
        category_items: allItemsInCategory,
    });
});

exports.category_detail = asyncHandler(async(req,res,next)=>{
    const [category,allItemsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({category:req.params.id},"name").exec(),
    ]);
    if(category===null){
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }
    res.render("category_detail",{
        title: "Category Detail",
        category:category,
        category_items:allItemsInCategory,
    });
});
