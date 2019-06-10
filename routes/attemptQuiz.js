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
        res.render('quizLayout',{
            quiz:quiz,
            title:"Quiz"
        });
    });
});

router.post('/quiz/:id',ensureAuthenticated,(req,res) => {
    const id = req.params.id;

    // id will be usefull for finding quiz
    console.log(req.body);
    // if answer is not selected than req.body.a(number) will be undefined
    // console.log(req.body.a0);   // answer of first question
    // console.log(req.body.a1);
    // console.log(req.body.a2);
    // console.log(req.body.a3);
    // //res.send(req.body);
    Quiz.findById(id)
    .exec((err, quiz) => {
        if(err) throw err;
        var cnt = 0;
        var a = Object.values(req.body);
        //console.log(a);
        for(var i=0; i< quiz.addQuestions.length; i++)
        {
            //console.log(quiz.addQuestions[i].answer);
            if(a[i]==quiz.addQuestions[i].answer)
                cnt++;    
        }
        //console.log(req.session.userInfo);
        //console.log(cnt);
        var n=quiz.addQuestions.length;
        var per = (cnt/n)*100.0;
        var stId = req.session.userInfo.studentId;
        var name = req.session.userInfo.name;
        var qname = quiz.name;
        var passfail = "Fail";
        if(per>=quiz.percentageToPass)
            passfail="Pass";
        //console.log(per);
        const newResult = new Result({
            studentId: stId,
            name: name,
            quizName: qname,
            percentage: per,
            passFail: passfail
        });
        console.log(newResult);
        newResult.save()
                        .then(result => {
                            //req.flash('success_msg', 'You are now registered and can log in');
                            res.redirect('/users/uquiz');
                        })
                        .catch(err => console.log(err));
        //res.redirect('/users/uquiz');
    });

    //res.redirect('/users/uquiz');
});
module.exports = router;