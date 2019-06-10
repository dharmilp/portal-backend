const express = require('express');
const router = express.Router();
const Group = require('../models/Groups');
const { ensureAuthenticated } = require('../config/auth');
const { ensureAuthenticatedAdmin } = require('../config/auth');


router.get('/',ensureAuthenticatedAdmin, function(req, res, next) {
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
                    title: "Groups",
                    pages: Math.ceil(count / perPage)
                });
            });
        });
});

router.post('/',ensureAuthenticatedAdmin, function(req, res, next) {
    const pageNum = req.query.page || 1;

    var newGroup = new Group({
        name:req.body.newGroupName
    });
    newGroup.save()
    .then((newgroup) => {
        req.flash('success_msg','Group added successfully!');
        const path = '/groups?page=' + pageNum; 
        res.redirect(path);
    })
    .catch((err) => {
        req.flash('error_msg','Something went wrong');
        console.log(err);
        res.redirect('/groups');
    });
});

router.get('/delete/:id',ensureAuthenticatedAdmin, function(req, res, next) {
    const id = req.params.id;
    const pageNum = req.query.page || 1;
    Group.findByIdAndRemove(id)
    .then((group) => {
        req.flash('success_msg','Group deleted successfully!');
        const path = '/groups?page=' + pageNum; 
        res.redirect(path);
    })
    .catch((err) => {
        req.flash('error_msg','Something went wrong');
        console.log(err);
        res.redirect('/groups');
    });
});

router.get('/groupEdit/:id',ensureAuthenticatedAdmin, function(req, res, next) {
    const id = req.params.id;
    const pageNum = req.query.page || 1;
    res.render('groupEdit',{
        id:id,
        title: "Edit Groups",
        pageNum:pageNum
    });
});

router.post('/groupUpdate/:id',ensureAuthenticatedAdmin, function(req, res, next) {
    const id = req.params.id;
    console.log(id);
    const pageNum = req.query.page || 1;
    Group.findByIdAndUpdate(id,{ $set: { name: req.body.newGroupName } },(err,group) => {
        console.log(group);
        if(err) {
            req.flash('error_msg','Something went wrong');
            console.log(err);
            res.redirect('/groups');
        } else {
            req.flash('success_msg','Group updated successfully!');
            const path = '/groups?page=' + pageNum; 
            res.redirect(path);
        }
    });
});
module.exports = router;