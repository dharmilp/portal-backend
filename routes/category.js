const express = require('express');
const router = express.Router();
const Categories = require('../models/Categories');
const { ensureAuthenticated } = require('../config/auth');


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

router.get('/delete/:id',ensureAuthenticated, function(req, res, next) {
    const id = req.params.id;
    const pageNum = req.query.page || 1;
    Categories.findByIdAndRemove(id)
    .then((category) => {
        const path = '/categories?page=' + pageNum; 
        res.redirect(path);
    })
    .catch((err) => {
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
    Categories.findOneAndUpdate(id,{ $set: { name: req.body.newCategoryName } },(err,category) => {
        if(err) {
            console.log(err);
            res.redirect('/categories');
        } else {
            const path = '/categories?page=' + pageNum; 
            res.redirect(path);
        }
    });
});
module.exports = router;