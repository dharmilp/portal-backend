const express = require('express');
const router = express.Router();
const Group = require('../models/Groups');
const { ensureAuthenticated } = require('../config/auth');


router.get('/',ensureAuthenticated, function(req, res, next) {
    var perPage = 9;
    var page = req.query.page || 1;

    Group
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, groups) {
            Group.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('groupList', {
                    groups: groups,
                    current: page,
                    docType: 'groups',
                    pages: Math.ceil(count / perPage)
                });
            });
        });
});

router.get('/delete/:id',ensureAuthenticated, function(req, res, next) {
    const id = req.params.id;
    const pageNum = req.query.page || 1;
    Group.findByIdAndRemove(id)
    .then((group) => {
        const path = '/groups?page=' + pageNum; 
        res.redirect(path);
    })
    .catch((err) => {
        console.log(err);
        res.redirect('/groups');
    });
});

router.get('/groupEdit/:id',ensureAuthenticated, function(req, res, next) {
    const id = req.params.id;
    const pageNum = req.query.page || 1;
    res.render('groupEdit',{
        id:id,
        pageNum:pageNum
    });
});

router.post('/groupUpdate/:id',ensureAuthenticated, function(req, res, next) {
    const id = req.params.id;
    const pageNum = req.query.page || 1;
    Group.findByIdAndUpdate(id,{ $set: { name: req.body.newGroupName } },(err,group) => {
        if(err) {
            console.log(err);
            res.redirect('/groups');
        } else {
            const path = '/groups?page=' + pageNum; 
            res.redirect(path);
        }
    });
});
module.exports = router;