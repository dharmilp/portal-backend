const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const { ensureAuthenticatedAdmin } = require('../config/auth');
const User = require('../models/User');
const Question = require('../models/Questions');
const Quiz = require('../models/Quiz');

router.get('/', (req, res) => res.render('welcome',{
    title: 'Welcome'        // title for page Welcome
}));
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    req.session.userInfo = req.session.userInfo || req.user;
    res.render('dashboard', {
        name: req.user.name,
        title: 'Dashboard'      // title for page Dashboard
    })
});

router.get('/admin', ensureAuthenticatedAdmin, (req, res, next) =>{

    User
        .count()
        .exec(function(err, users){
            Question
                    .count()
                    .exec(function(err, questions){
                        Quiz
                            .count()
                            .exec(function(err, quizes){
                                if(err) return next(err)
                                res.render('admin', {
                                    name: req.user.name,
                                    title: 'Admin Dashboard',
                                    usercount: users,
                                    questioncount: questions,
                                    quizcount: quizes
                                });
                            });
                    });
        });

    // res.render('admin', {
    //     name: req.user.name,
    //     title: 'Admin Dashboard'      // title for page Admin Dashboard
    // })
});

module.exports = router;