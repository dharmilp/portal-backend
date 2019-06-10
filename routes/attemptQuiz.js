const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Questions = require('../models/Questions');
const { ensureAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');

router.get('/quiz/:id',ensureAuthenticated,(req,res) => {
    const id = req.params.id;
    Quiz.findById(id)
    .exec((err,quiz) => {
        if(err) throw err;
        res.render('quizLayout1',{
            quiz:quiz,
        });
    });
});

router.post('/quiz/:id',ensureAuthenticated,(req,res) => {
    const id = req.params.id;

    // id will be usefull for finding quiz
    console.log(req.body);
    // if answer is not selected than req.body.a(number) will be undefined
    console.log(req.body.a0);   // answer of first question
    console.log(req.body.a1);
    console.log(req.body.a2);
    console.log(req.body.a3);
    res.send(req.body);
});
module.exports = router;