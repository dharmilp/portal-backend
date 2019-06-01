const express = require('express');
const router = express.Router();
const Group = require('../models/Groups');
const Quiz = require('../models/Quiz');
const Questions = require('../models/Questions');
const { ensureAuthenticated } = require('../config/auth');

router.get('/addQuizQuestion', (req,res) => {
    var perPage = 9;
    var page = req.query.page || 1;

    Questions
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, questions) {
            Questions.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('addQuizQuestion', {
                    questions: questions,
                    current: page,
                    docType: 'questions',
                    pages: Math.ceil(count / perPage)
                });
            });
        });
});

router.get('/addquiz',ensureAuthenticated, function(req, res, next){
    //console.log("Redirection success");
    Group
        .find({})
        .exec(function(err, groups){
        //console.log(groups);
        res.render('addquiz',{
            name: "",
            title: 'Add quiz',
            groups: groups 
        });
    });
});


router.post('/addquiz',ensureAuthenticated, function(req, res, next ){
    const { name, startDate, duration, percentageToPass, assignToGroups, addQuestions } = req.body;
    let errors = [];
    console.log(req.body);
    if(!name || !startDate || !duration || !percentageToPass || !assignToGroups || !addQuestions )
        errors.push({ msg: 'Please fill all the fields' });
    if(errors.length > 0)
    {
        Group
            .find({})
            .exec(function(err, groups){
                //console.log(groups);
                res.render('addquiz',{
                    name,
                    errors,
                    startDate,
                    duration,
                    percentageToPass,
                    name: "",
                    title: 'Add quiz',
                    groups: groups 
                });
            });
        // res.render('addquiz', { 
        //     name,
        //     errors, 
        //     startDate, 
        //     duration,
        //     percentageToPass 
        // });
    }
    else
    {
        const newQuiz = new Quiz({
            name: req.body.name,
            duration: req.body.duration,
            startDate: req.body.startDate,
            percentageToPass: req.body.percentageToPass,
            assignToGroups: req.body.assignToGroups,
            addQuestions: req.body.addQuestions
            });
        
            newQuiz.save()
            .then(
            newQuiz => {
                req.flash('success_msg', 'Quiz successfully added!');
                res.redirect('/quiz/addquiz');
            })
            .catch(err => {
                req.flash('error_msg','Wrong Format');
                res.redirect('/quiz/addquiz');
            });
    }
});

router.get('/quizDelete/:id',ensureAuthenticated, function(req, res, next) {
    const id = req.params.id;
    const pageNum = req.query.page || 1;
    Quiz.findByIdAndRemove(id)
    .then((quiz) => {
        const path = '/users/aquiz?page=' + pageNum; 
        res.redirect(path);
    })
    .catch((err) => {
        console.log(err);
        res.redirect('/users/aquiz');
    });
  });
  
router.get('/quizEdit/:id',ensureAuthenticated, function(req, res, next) {
    const id = req.params.id;
    const pageNum = req.query.page || 1;
    
    Group
    .find({})
    .exec(function(err, groups){
        //console.log(groups);
        Quiz.findById(id).exec(function(err, quiz) {
            res.render('quizEdit',{
                id:id,
                name: quiz.name,
                startDate: quiz.startDate,
                duration: quiz.duration,
                assignToGroups: quiz.assignToGroups,
                addQuestions: quiz.addQuestions,
                pageNum:pageNum,
                groups: groups 
            });
        });
    });
});
  
  router.post('/quizUpdate/:id',ensureAuthenticated, function(req, res, next) {
    const id = req.params.id;
    const pageNum = req.query.page || 1;
    Quiz.findByIdAndUpdate(id,{ $set: { name: req.body.name,
      duration: req.body.duration,
      startDate: req.body.startDate,
      percentageToPass: req.body.percentageToPass,
      assignToGroups: req.body.assignToGroups,
      addQuestions: req.body.addQuestions } },(err,quiz) => {
        if(err) {
            console.log(err);
            res.redirect('/users/aquiz');
        } else {
            const path = '/users/aquiz?page=' + pageNum; 
            res.redirect(path);
        }
    });
  });
  
router.post('/addQuizQuestion',ensureAuthenticated, function(req, res, next) {

})

module.exports = router;