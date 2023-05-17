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

})