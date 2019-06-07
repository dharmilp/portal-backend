const express = require('express');
const router = express.Router();
const Categories = require('../models/Categories');
const { ensureAuthenticated } = require('../config/auth');
const { ensureAuthenticatedAdmin } = require('../config/auth');


router.get('/',ensureAuthenticated, function(req, res, next) {
    var perPage = 9;
    var page = req.query.page || 1;

    Categories
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, categories) {
            Categories.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('categoryList', {
                    categories: categories,
                    current: page,
                    docType: 'categories',
                    pages: Math.ceil(count / perPage)
                });
            });
        });
});

router.post('/',ensureAuthenticated, function(req, res, next) {
    const pageNum = req.query.page || 1;

    var newCategory = new Categories({
        name:req.body.newCategoryName
    });
    newCategory.save()
    .then((newcategory) => {
        req.flash('success_msg','category added successfully');
        const path = '/categories?page=' + pageNum; 
        res.redirect(path);
    })
    .catch((err) => {
        req.flash('error_msg','Something went wrong');
        console.log(err);
        res.redirect('/groups');
    });
});

router.get('/delete/:id',ensureAuthenticated, function(req, res, next) {
    const id = req.params.id;
    const pageNum = req.query.page || 1;
    Categories.findByIdAndRemove(id)
    .then((category) => {
        req.flash('success_msg','category deleted successfully');
        const path = '/categories?page=' + pageNum; 
        res.redirect(path);
    })
    .catch((err) => {
        req.flash('error_msg','Something went wrong');
        console.log(err);
        res.redirect('/categories');
    });
});

router.get('/categoryEdit/:id',ensureAuthenticated, function(req, res, next) {
    const id = req.params.id;
    const pageNum = req.query.page || 1;
    res.render('categoryEdit',{
        id:id,
        pageNum:pageNum
    });
});

router.post('/categoryUpdate/:id',ensureAuthenticated, function(req, res, next) {
    const id = req.params.id;
    const pageNum = req.query.page || 1;
    Categories.findByIdAndUpdate(id,{ $set: { name: req.body.newCategoryName } },(err,category) => {
        if(err) {
            req.flash('error_msg','Something went wrong');
            console.log(err);
            res.redirect('/categories');
        } else {
            req.flash('success_msg','category updated successfully');
            const path = '/categories?page=' + pageNum; 
            res.redirect(path);
        }
    });
});
module.exports = router;