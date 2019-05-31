const express = require('express');
const router = express.Router();
const Group = require('../models/groups');
const { ensureAuthenticated } = require('../config/auth');


router.get('/',async function(req, res, next) {
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

module.exports = router;