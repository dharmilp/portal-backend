const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const { ensureAuthenticatedAdmin } = require('../config/auth');
const User = require('../models/User');
const Question = require('../models/Questions');
const Quiz = require('../models/Quiz');
const Result = require('../models/Results');

router.get('/', (req, res) => res.render('welcome',{
    title: 'Welcome'        // title for page Welcome
}));
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    req.session.userInfo = req.session.userInfo || req.user;
    Result.find({studentId: req.session.userInfo.studentId})
    .exec(function(err, result){
        if(err) throw err;
        res.render('dashboard', {
            name: req.user.name,
            title: 'Dashboard',      // title for page Dashboard
            result: result,
        })
    });
});

router.get('/temp-data', (req,res) => {
    Result.find({studentId: req.session.userInfo.studentId})
    .exec((err, data) => {
        res.send(data);
    });
});

router.get('/admin', ensureAuthenticatedAdmin, (req, res, next) =>{

    User
        .countDocuments()
        .exec(function(err, users){
            Question
                    .countDocuments()
                    .exec(function(err, questions){
                        Quiz
                            .countDocuments()
                            .exec(function(err, quizes){
                                Result
                                    .countDocuments()
                                    .exec(function(err, results){
                                        if(err) return next(err)
                                        res.render('admin', {
                                            name: req.user.name,
                                            title: 'Admin Dashboard',
                                            usercount: users,
                                            questioncount: questions,
                                            quizcount: quizes,
                                            result: results
                                        });
                                    });
                            });
                    });
        });
});

module.exports = router;