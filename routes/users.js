const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const crypto = require('crypto');
const async = require('async');
const nodemailer = require('nodemailer');
const { ensureAuthenticated } = require('../config/auth');
const Group = require('../models/Groups');

const User = require('../models/User');
//const Question = require('../models/Questions');
const mailSetup = require('../config/mailSetup');

const Question = require('../models/Questions');
const Quiz = require('../models/Quiz');

router.get('/login', (req, res) => {
  if(typeof req.session.userInfo == 'undefined')
  {
    res.render('login',{
      title: 'Login'          // title for page Login
    });
  }
  else
  {
    res.redirect('/dashboard');
  }
});
router.get('/signup', (req, res) => {
  Group.find({})
  .exec((err,groups) => {
    if(err)
    {
      console.log(err);
      res.redirect('/signup');
    }
    else
    {
      res.render('signup',{
        title: 'Register',       // title for page register
        groups: groups
      });
    }
  });
});
router.get('/forgot', (req,res) => res.render('forgot',{
    title: 'Reset Password'
}));
router.get('/uquiz', (req,res) => {
  const perPage = 9;
  const pageNum = req.query.page || 1;
  Quiz.find({"assignToGroups" : req.session.userInfo.group})
  .select({
      "_id": 1,
      "name": 1,
      "duration": 1,
      startDate: 1
    })
  .exec((err,quiz) => {
    console.log(quiz);
    if(err) throw err;
    const count = quiz.length;
    res.render('uquiz',{
      title: 'Quiz',
      quizzes: quiz,
      current: pageNum,
      docType: 'users/uquiz',
      pages: Math.ceil(count / perPage)
    });
  });
});
router.get('/uresult', (req,res) => res.render('uresult',{
  title: 'Result'
}));
router.get('/umyaccount', (req,res) => res.render('umyaccount',{
  title: 'Account'
}));


router.get('/auser', (req,res,next) => { 

  var perPage = 9;
  var page = req.query.page || 1;
  User
          .find({})
          .skip((perPage * page) - perPage)
          .limit(perPage)
          .exec(function(err, users) {
          User.count().exec(function(err, count) {
          if (err) return next(err)
          res.render('auser',{
          name: "",
          users: users,
          current: page,
          docType: 'users/auser',
          pages: Math.ceil(count / perPage),
          title: 'Users'
        });
      });
  });
});



router.get('/questionbank', (req, res, next) => {
    var perPage = 9;
    var page = req.query.page || 1;
    Question
            .find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function(err, questions) {
            Question.count().exec(function(err, count) {
            if (err) return next(err)
            res.render('questionbank',{
            name: "",
            questions: questions,
            current: page,
            docType: 'users/questionbank',
            pages: Math.ceil(count / perPage),
            title: 'Question Bank'
          });
        });
    });
});

// router.get('/addQuizQuestion', (req, res, next) => {
//   var perPage = 9;
//   var page = req.query.page || 1;
//   Question
//           .find({})
//           .skip((perPage * page) - perPage)
//           .limit(perPage)
//           .exec(function(err, questions) {
//           Question.count().exec(function(err, count) {
//           if (err) return next(err)
//           res.render('addQuizQuestion',{
//           name: "",
//           questions: questions,
//           current: page,
//           docType: 'questions',
//           pages: Math.ceil(count / perPage)
//         });
//       });
//   });
// });

router.get('/aquiz', (req, res, next) => {
  var perPage = 9;
  var page = req.query.page || 1;
  Quiz
          .find({})
          .skip((perPage * page) - perPage)
          .limit(perPage)
          .exec(function(err, quiz) {
          Quiz.count().exec(function(err, count) {
          if (err) return next(err)
          res.render('aquiz',{
          name: "",
          quiz: quiz,
          current: page,
          docType: 'users/aquiz',
          pages: Math.ceil(count / perPage),
          title: 'Quiz'
        });
      });
  });
});


router.get('/settings', (req,res) => res.render('settings',{
  name: "",
  title: 'Settings'
}));
router.get('/aquiz', (req,res) => res.render('aquiz',{
  name: "",
  title: 'Quiz'
}));
router.get('/aresult', (req,res) => res.render('aresult',{
  name: "",
  title: 'Result'
}));
router.get('/amyaccount', (req,res) => res.render('amyaccount',{
  name: "",
  title: 'Account'
}));


router.get('/addquestion', (req,res) => res.render('addques',{
  name: "",
  title: 'Add Question'
}));


router.get('/delete/:id', function(req, res, next) {
  const id = req.params.id;
  const pageNum = req.query.page || 1;
  Question.findByIdAndRemove(id)
  .then((group) => {
      const path = '/users/questionbank?page=' + pageNum; 
      res.redirect(path);
  })
  .catch((err) => {
      console.log(err);
      res.redirect('/users/questionbank');
  });
});

router.get('/questionEdit/:id', function(req, res, next) {
  const id = req.params.id;
  const pageNum = req.query.page || 1;
  res.render('questionEdit',{
      id:id,
      pageNum:pageNum,
      title: "Edit Question"
  });
});

router.post('/questionUpdate/:id', function(req, res, next) {
  const id = req.params.id;
  const pageNum = req.query.page || 1;
  Question.findByIdAndUpdate(id,{ $set: { qtype: req.body.quetype, 
                                          category: req.body.selectCategory,
                                          question: req.body.textarea1,
                                          option1: req.body.textarea2,
                                          option2: req.body.textarea3,
                                          option3: req.body.textarea4,
                                          option4: req.body.textarea5,
                                          answer: req.body.score } },(err,group) => {
      if(err) {
          console.log(err);
          res.redirect('/users/questionbank');
      } else {
          const path = '/users/questionbank?page=' + pageNum; 
          res.redirect(path);
      }
  });
});

router.post('/signup', (req, res) => {
    const { name, studentId, email, password, password2,group } = req.body;
    let errors = [];

    if(!name || !studentId || !email || !password || !password2)
        errors.push({ msg: 'Please fill all the fields' });

    if(password!==password2)
        errors.push({ msg: 'Password do not match' });

    if(password.length < 6)
        errors.push({ msg: 'Password should be atleast 6 characters' });

    if(errors.length > 0)
    {
      Group.find({})
      .exec((err,groups) => {
        res.render('signup', { 
          studentId,
          errors, 
          name, 
          email,
          groups
        });
      })
    }
    else
    {
        User.findOne({ email: email })
        .then(user => {
            if(user){
              errors.push({ msg: 'Email is already registered' });
              Group.find({})
              .exec((err, groups) => {
                res.render('signup', { 
                  errors, 
                  name,
                  studentId, 
                  email, 
                  password, 
                  password2,
                  groups 
                });
              })
            }
            else{
                const newUser = new User({
                    name,
                    studentId,
                    email,
                    password,
                    group
                });  
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now registered and can log in');
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                }))
            }
        })
    }
});

router.post('/login', (req, res, next) => {
    var str = req.body.studentId;
    var adm = "Admin";
    //console.log(str);
    passport.authenticate('local', {
      successRedirect: str.localeCompare(adm)==0 ? '/admin':'/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });

router.get('/logout', (req, res) => {
    req.logout();
    req.session.userInfo = undefined;
    req.flash('success_msg', 'You are Logged Out');
    res.redirect('/users/login');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ studentId: req.body.studentId }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that studentId exists.');
          return res.redirect('/users/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport(mailSetup);
      var mailOptions = {
        to: user.email,
        from: 'SPC',
        subject: 'SPC Test Portal Password Reset',
        text: 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/users/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success_msg', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/users/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/users/forgot');
    }
    res.render('reset', {
      token: req.params.token
    });
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        bcrypt.genSalt(10, (err, salt) => 
          bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) throw err;
            user.password = hash;
            user.save()
            .then(user => {
              req.flash('success_msg', 'Password was changed Successfully');
              res.redirect('/users/login');
            })
            .catch(err => console.log(err));
        }))

      });
    }
  ], function(err) {
    res.redirect('/');
  });
});


router.post('/addquestion', (req, res) => {
  console.log(req.body);
    const newQues = new Question({
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
      res.redirect('/users/addquestion');
  })
  .catch(err => console.log(err));
});

module.exports = router;