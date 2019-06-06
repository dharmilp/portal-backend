const express = require('express');
const router = express.Router();
const Group = require('../models/Groups');
const Quiz = require('../models/Quiz');
const Questions = require('../models/Questions');
const { ensureAuthenticated } = require('../config/auth');
const moment = require('moment');
const mongoose = require('mongoose');
var cnt = 0;

router.get('/addQuizQuestion', (req,res) => {
    var perPage = 9;
    var page = req.query.page || 1;
    Questions
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, questions) {
            Questions.count().exec(function(err, count) {
                if (err) return next(err);
                res.render('addQuizQuestion', {
                    questions: questions,
                    current: page,
                    docType: 'questions',
                    pages: Math.ceil(count / perPage)
                });
            });
        });
});

router.get('/editQuizQuestion', (req,res) => {
    var perPage = 9;
    var page = req.query.page || 1;
    Questions
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, questions) {
            Questions.count().exec(function(err, count) {
                if (err) return next(err);
                res.render('editQuizQuestion', {
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
        const questionTempArr = req.session.questionIdList || [];
        var queryArr = [];
        for(var i=0;i<questionTempArr.length;i++)
            queryArr.push(mongoose.Types.ObjectId(questionTempArr[i]));
        Questions.find({ _id: { $in : queryArr } },(err,questions) => {
            res.render('addquiz',{
                name: "",
                title: 'Add quiz',
                groups: groups,
                moment: moment, 
                questions: questions
            });
        });
    });
});


router.post('/addquiz',ensureAuthenticated, function(req, res, next ){
    const bt = req.body.buttonType;
    if(bt.localeCompare("Add Questions Manually") == 0)
    {
        req.session.quizInfo = req.body || {} ;
        if(typeof req.session.quizInfo != 'undefined' && typeof req.session.quizInfo.assignToGroups != 'undefined')
        {
            if((typeof req.session.quizInfo.assignToGroups).localeCompare('string') == 0)
            {
                var temp = req.session.quizInfo.assignToGroups;
                req.session.quizInfo.assignToGroups = temp.split();
            }
        }
        res.redirect('/quiz/addQuizQuestion');
        return;
    }
    const { name, startDate, duration, percentageToPass, assignToGroups } = req.body;
    const addQuestions = req.session.questionIdList || [];
    let errors = [];
    if(!name || !startDate || !duration || !percentageToPass || !assignToGroups || addQuestions.length == 0 )
        errors.push({ msg: 'Please fill all the fields' });
    if(errors.length > 0)
    {
        Group
            .find({})
            .exec(function(err, groups){
                res.redirect('/quiz/addquiz');
            });
    }
    else
    {
        const questionTempArr = req.session.questionIdList || [];
        var queryArr = [];
        for(var i=0;i<questionTempArr.length;i++)
            queryArr.push(mongoose.Types.ObjectId(questionTempArr[i]));
        Questions.find({ _id: { $in : queryArr } },(err,questions) => {
            const newQuiz = new Quiz({
                name: req.body.name,
                duration: req.body.duration,
                startDate: req.body.startDate,
                percentageToPass: req.body.percentageToPass,
                assignToGroups: req.body.assignToGroups,
                addQuestions: questions
            });
            newQuiz.save()
            .then(
            newQuiz => {
                req.flash('success_msg', 'Quiz successfully added!');
                req.session.quizInfo = undefined;
                req.session.questionIdList = undefined;
                res.redirect('/quiz/addquiz');
            })
            .catch(err => {
                req.flash('error_msg','Wrong Format');
                res.redirect('/quiz/addquiz');
            });
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
        // console.log(err);
        res.redirect('/users/aquiz');
    });
  });
  
router.get('/quizEdit/:id',ensureAuthenticated, function(req, res, next) {
    const id = req.params.id;
    const pageNum = req.query.page || 1;
    
    req.session.quizEditQuestionList = req.session.quizEditQuestionList || [];
    Group
    .find({})
    .exec(function(err, groups){
        //console.log(groups);
        Quiz.findById(id).exec(function(err, quiz) {
            req.session.quizEditInfo = req.session.quizEditInfo || quiz;
            if( cnt == 0 )
            {
                for(var i=0;i<req.session.quizEditInfo.addQuestions.length;i++)
                {
                    req.session.quizEditQuestionList.push(req.session.quizEditInfo.addQuestions[i]._id);
                }
            }
            // console.log(req.session.quizEditQuestionList);
            const questionTempArr1 = req.session.quizEditQuestionList || [];
            var queryArr1 = [];
            for(var i=0;i<questionTempArr1.length;i++)
                queryArr1.push(mongoose.Types.ObjectId(questionTempArr1[i]));   
            //console.log(queryArr1); 
            Questions.find({ _id: { $in : queryArr1 } },(err,questions) => {
                //console.log(questions);
                res.render('quizEdit',{
                    quiz:quiz,
                    pageNum:pageNum,
                    groups: groups,
                    moment:moment, 
                    questions: questions,
                });
            });
        });
    });
});
  
router.post('/quizUpdate/:id',ensureAuthenticated, function(req, res, next) {

    const bt = req.body.buttonType;
    if(bt.localeCompare("Add Questions Manually") == 0)
    {
        req.session.quizEditInfo = req.body || {} ;
        if(typeof req.session.quizEditInfo != 'undefined' && typeof req.session.quizEditInfo.assignToGroups != 'undefined')
        {
            if((typeof req.session.quizEditInfo.assignToGroups).localeCompare('string') == 0)
            {
                var temp = req.session.quizEditInfo.assignToGroups;
                req.session.quizEditInfo.assignToGroups = temp.split();
            }
        }
        res.redirect('/quiz/editQuizQuestion');
        return;
    }

    const id = req.params.id;
    const pageNum = req.query.page || 1;

    Quiz.findByIdAndUpdate(id,{ $set: { name: req.body.name,
        duration: req.body.duration,
        startDate: req.body.startDate,
        percentageToPass: req.body.percentageToPass,
        assignToGroups: req.body.assignToGroups,
        addQuestions: req.session.quizEditQuestionList } },(err,quiz) => {
        if(err) {
            // console.log(err);
            res.redirect('/users/aquiz');
        } else {
            req.session.quizEditQuestionList = undefined;
            req.session.quizEditInfo = undefined;
            const path = '/users/aquiz?page=' + pageNum; 
            res.redirect(path);
        }
    });
});
  
router.get('/addQuizQuestion/:id',ensureAuthenticated, function(req, res, next) {
    const id = req.params.id;
    const pageNum = req.query.page || 1;
    req.session.questionIdList = req.session.questionIdList || [];
    var index = -1;
    for(var i=0;i<req.session.questionIdList.length;i++)
    {
        if(req.session.questionIdList[i].localeCompare(id) == 0)
        {
            index = i;
            break;
        }
    }
    if(index == -1)
    {
        req.session.questionIdList.push(id);
        // console.log('index = -1');
    }
    else
    {
        req.session.questionIdList.splice(index,1);
        // console.log('index is present');
    }
    res.redirect('/quiz/addQuizQuestion');
});

router.get('/addQuizRemove/:id',ensureAuthenticated, function(req, res, next) {
    const id = req.params.id;
    req.session.questionIdList = req.session.questionIdList || [];
    var index = -1;
    for(var i=0;i<req.session.questionIdList.length;i++)
    {
        if(req.session.questionIdList[i].localeCompare(id) == 0)
        {
            index = i;
            break;
        }
    }
    if(index == -1)
    {
        req.session.questionIdList.push(id);
        // console.log('index = -1');
    }
    else
    {
        req.session.questionIdList.splice(index,1);
        // console.log('index is present');
    }
    if(req.session.questionIdList.length == 0)
        req.session.questionIdList = undefined;
    res.redirect('/quiz/addquiz');
});

router.get('/editQuizRemove/:id',ensureAuthenticated, function(req, res, next) {
    const id = req.params.id;
    req.session.quizEditQuestionList = req.session.quizEditQuestionList || [];
    var index = -1;
    for(var i=0;i<req.session.quizEditQuestionList.length;i++)
    {
        if(req.session.quizEditQuestionList[i].localeCompare(id) == 0)
        {
            index = i;
            break;
        }
    }
    // console.log(index);
    if(index == -1)
    {
        req.session.quizEditQuestionList.push(id);
        // console.log('index = -1');
    }
    else
    {
        req.session.quizEditQuestionList.splice(index,1);
        cnt++;
        //console.log(req.session.quizEditQuestionList.length);
        // console.log('index is present');
    }
    if(req.session.quizEditQuestionList.length == 0)
        req.session.quizEditQuestionList = undefined;
    const path = '/quiz/quizEdit/' + req.session.quizEditInfo._id;
    res.redirect(path);
});

module.exports = router;