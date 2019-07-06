const express = require('express');
const router = express.Router();
const Group = require('../models/Groups');
const Quiz = require('../models/Quiz');
const Questions = require('../models/Questions');
const { ensureAuthenticated } = require('../config/auth');
const { ensureAuthenticatedAdmin } = require('../config/auth');
const moment = require('moment');
const mongoose = require('mongoose');

router.get('/addQuizQuestion', ensureAuthenticatedAdmin,(req,res) => {
    var perPage = 9;
    var page = req.query.page || 1;
    Questions
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, questions) {
            Questions.countDocuments().exec(function(err, count) {
                if (err) return next(err);
                res.render('addQuizQuestion', {
                    questions: questions,
                    current: page,
                    docType: 'quiz/addQuizQuestion',
                    title: "Add Question to Quiz",
                    pages: Math.ceil(count / perPage)
                });
            });
        });
});

router.get('/editQuizQuestion', ensureAuthenticatedAdmin,(req,res) => {
    var perPage = 9;
    var page = req.query.page || 1;
    Questions
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, questions) {
            Questions.countDocuments().exec(function(err, count) {
                if (err) return next(err);
                res.render('editQuizQuestion', {
                    questions: questions,
                    current: page,
                    docType: 'quiz/editQuizQuestion',
                    title: "Edit Question of Quiz",
                    pages: Math.ceil(count / perPage)
                });
            });
        });
});

router.get('/editQuizQuestion/:id',ensureAuthenticatedAdmin, function(req, res, next) {
    const id = req.params.id;
    const pageNum = req.query.page || 1;
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
    if(index == -1)
    {
        req.session.quizEditQuestionList.push(id);
    }
    else
    {
        req.session.quizEditQuestionList.splice(index,1);
    }
    res.redirect('/quiz/editQuizQuestion');
});

router.get('/addquiz',ensureAuthenticatedAdmin, function(req, res, next){
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


router.post('/addquiz',ensureAuthenticatedAdmin, function(req, res, next ){
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
        req.flash('error_msg',errors[0].msg);
        res.redirect('/quiz/addquiz');1
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
                res.redirect('/users/aquiz');
            })
            .catch(err => {
                req.flash('error_msg','Wrong Format');
                res.redirect('/quiz/addquiz');
            });
        });
    }
});

router.get('/quizDelete/:id',ensureAuthenticatedAdmin, function(req, res, next) {
    const id = req.params.id;
    const pageNum = req.query.page || 1;
    Quiz.findByIdAndRemove(id)
    .then((quiz) => {
        const path = '/users/aquiz?page=' + pageNum;
        req.flash('success_msg','Quiz deleted successfully!');
        res.redirect(path);
    })
    .catch((err) => {
        req.flash('error_msg','Something went wrong!');
        res.redirect('/users/aquiz');
    });
  });
  
router.get('/quizEdit/:id',ensureAuthenticatedAdmin, function(req, res, next) {
    const id = req.params.id;
    const pageNum = req.query.page || 1;
    if(typeof req.session.quizEditInfo != 'undefined')
    {
        if(req.session.quizEditInfo._id.localeCompare(id) != 0)
        {
            req.session.quizEditInfo = undefined;
            req.session.quizEditQuestionList = undefined;
        }
    }
    Group
    .find({})
    .exec(function(err, groups){
        Quiz.findById(id).exec(function(err, quiz) {
            if(typeof req.session.quizEditInfo == 'undefined')
            {
                req.session.quizEditQuestionList = [];
                req.session.quizEditInfo = quiz;
                for(var i=0;i<quiz.addQuestions.length;i++)
                    req.session.quizEditQuestionList.push(quiz.addQuestions[i]._id);
            }
            var queryArr = [];
            for(var i=0;i<req.session.quizEditQuestionList.length;i++)
                queryArr.push(mongoose.Types.ObjectId(req.session.quizEditQuestionList[i]));
            
            Questions.find({ _id: { $in : queryArr } },(err,questions) => {
                res.render('quizEdit',{
                    quiz:quiz,
                    pageNum:pageNum,
                    groups: groups,
                    moment:moment, 
                    questions: questions,
                    title: "Edit Quiz",
                });
            });
        });
    });
});
  
router.post('/quizUpdate/:id',ensureAuthenticatedAdmin, function(req, res, next) {

    const bt = req.body.buttonType;
    if(bt.localeCompare("Add Questions Manually") == 0)
    {
        req.session.quizEditInfo.name = req.body.name;
        req.session.quizEditInfo.startDate = req.body.startDate;
        req.session.quizEditInfo.duration = req.body.duration;
        req.session.quizEditInfo.percentageToPass = req.body.percentageToPass;
        req.session.quizEditInfo.assignToGroups = req.body.assignToGroups;
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

    var queryArr = [];
    for(var i=0;i<req.session.quizEditQuestionList.length;i++)
        queryArr.push(mongoose.Types.ObjectId(req.session.quizEditQuestionList[i]));

    Questions.find({ _id: { $in : queryArr } },(err,questions) => {
        Quiz.findByIdAndUpdate(id,{ $set: { name: req.body.name,
        duration: req.body.duration,
        startDate: req.body.startDate,
        percentageToPass: req.body.percentageToPass,
        assignToGroups: req.body.assignToGroups,
        addQuestions: questions } },(err,quiz) => {
            if(err) {
                req.flash('error_msg',"Something went wrong");
                res.redirect('/users/aquiz');
            } else {
                req.session.quizEditQuestionList = undefined;
                req.session.quizEditInfo = undefined;
                const path = '/users/aquiz?page=' + pageNum;
                req.flash('success_msg',"Quiz updated successfully"); 
                res.redirect(path);
            }
        });
    });
});
  
router.get('/addQuizQuestion/:id',ensureAuthenticatedAdmin, function(req, res, next) {
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
    }
    else
    {
        req.session.questionIdList.splice(index,1);
    }
    res.redirect('/quiz/addQuizQuestion');
});

router.get('/addQuizRemove/:id',ensureAuthenticatedAdmin, function(req, res, next) {
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
    }
    else
    {
        req.session.questionIdList.splice(index,1);
    }
    if(req.session.questionIdList.length == 0)
        req.session.questionIdList = undefined;
    res.redirect('/quiz/addquiz');
});

router.get('/editQuizRemove/:id',ensureAuthenticatedAdmin, function(req, res, next) {
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
    if(index == -1)
    {
        req.session.quizEditQuestionList.push(id);
    }
    else
    {
        req.session.quizEditQuestionList.splice(index,1);
    }
    const path = '/quiz/quizEdit/' + req.session.quizEditInfo._id;
    res.redirect(path);
});

router.get('/addquestion', (req,res) => res.render('addquestionquiz',{
    name: "",
    title: 'Add Question'
  }));


router.post('/addquestion', ensureAuthenticatedAdmin,(req, res) => {
      const newQues = new Questions({
      qtype: req.body.quetype,
      category: req.body.selectCategory,
      question: req.body.textarea1,
      option1: req.body.textarea2,
      option2: req.body.textarea3,
      option3: req.body.textarea4,
      option4: req.body.textarea5,
      answer: req.body.score
    });
  
    newQues.save()
    .then(
      newQues => {
        req.flash('success_msg', 'Question successfully added!');
        res.redirect('/quiz/addquestion');
    })
    .catch(err => console.log(err));
  });

  router.get('/editAddQuestion', (req,res) => res.render('editAddQuestionQuiz',{
    name: "",
    title: 'Add Question'
  }));


router.post('/editAddQuestion', ensureAuthenticatedAdmin, (req, res) => {
      const newQues = new Questions({
      qtype: req.body.quetype,
      category: req.body.selectCategory,
      question: req.body.textarea1,
      option1: req.body.textarea2,
      option2: req.body.textarea3,
      option3: req.body.textarea4,
      option4: req.body.textarea5,
      answer: req.body.score
    });
  
    newQues.save()
    .then(
      newQues => {
        req.flash('success_msg', 'Question successfully added!');
        res.redirect('/quiz/editQuizQuestion');
    })
    .catch(err => console.log(err));
  });

router.get('/attempt/:id',ensureAuthenticated,(req,res) => {
    const id = req.params.id;
    const path = '/quizlive' + id;
    Quiz.findById(id)
    .select({
        "_id": 1,
        "name": 1,
        "duration": 1,
        startDate: 1,
        percentageToPass: 1
        })
    .exec((err,quiz) => {
        if(err) throw err;
        res.render('quizInstruction',{
            title: "Quiz Instructions",
            quizinfo: quiz
        });
    });
});
module.exports = router;