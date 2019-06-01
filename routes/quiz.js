const express = require('express');
const router = express.Router();
const Group = require('../models/Groups');
const Quiz = require('../models/Quiz');
const { ensureAuthenticated } = require('../config/auth');

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
              .catch(err => console.log(err));
        }
});

module.exports = router;