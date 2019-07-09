const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Result = require('../models/Results');
const Questions = require('../models/Questions');
const { ensureAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');

router.get('/quiz/:id',ensureAuthenticated,(req,res) => {
    const id = req.params.id;
    Quiz.findById(id)
    .exec((err,quiz) => {
        if(err) throw err;
        const currTime = Date.now();
        const startTimeID = 'StartTime' + id;
        req.session.startTimeID = req.session.startTimeID || currTime;
        //total seconds passed till started
        var remainingTime = 0;
        const timePassedTillStart = Math.floor((currTime - req.session.startTimeID)/1000);
        if(timePassedTillStart < (quiz.duration * 60))
            remainingTime = (quiz.duration * 60) - timePassedTillStart;
        console.log(remainingTime);
        res.render('quizLayout',{
            quiz:quiz,
            title:"Quiz",
            remainingTime:remainingTime
        });
    });
});

router.post('/quiz/:id',ensureAuthenticated,(req,res) => {
    const id = req.params.id;
    const startTimeID = 'StartTime' + id;
    // destroying value
    req.session.startTimeID = null;

    // id will be usefull for finding quiz
    // if answer is not selected than req.body.a(number) will be undefined
    // console.log(req.body.a0);   // answer of first question

    Quiz.findById(id)
    .exec((err, quiz) => {
        if(err) throw err;
        var cnt = 0;
        var a = Object.values(req.body);
        for(var i=0; i< quiz.addQuestions.length; i++)
        {
            if(a[i]==quiz.addQuestions[i].answer)
                cnt++;    
        }
        var n=quiz.addQuestions.length;
        var per = (cnt/n)*100.0;
        var stId = req.session.userInfo.studentId;
        var name = req.session.userInfo.name;
        var qname = quiz.name;
        var passfail = "Fail";
        if(per>=quiz.percentageToPass)
            passfail="Pass";
        const newResult = new Result({
            studentId: stId,
            name: name,
            quizName: qname,
            percentage: per,
            passFail: passfail
        });
        newResult.save()
        .then(result => {
            res.redirect('/users/uquiz');
        })
        .catch(err => console.log(err));
    });
});
module.exports = router;