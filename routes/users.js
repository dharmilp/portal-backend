const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const crypto = require('crypto');
const async = require('async');
const nodemailer = require('nodemailer');

const User = require('../models/User');
const mailSetup = require('../config/mailSetup');

router.get('/login', (req, res) => res.render('login',{
    title: 'Login'          // title for page Login
}));
router.get('/signup', (req, res) => res.render('signup',{
    title: 'Register'       // title for page register
}));
router.get('/forgot', (req,res) => res.render('forgot',{
    title: 'Reset Password'
}));

router.post('/signup', (req, res) => {
    const { name, studentId, email, password, password2 } = req.body;
    let errors = [];

    if(!name || !studentId || !email || !password || !password2)
        errors.push({ msg: 'Please fill all the fields' });

    if(password!==password2)
        errors.push({ msg: 'Password do not match' });

    if(password.length < 6)
        errors.push({ msg: 'Password should be atleast 6 characters' });

    if(errors.length > 0)
    {
        res.render('signup', { 
            studentId,
            errors, 
            name, 
            email 
        });
    }
    else
    {
        User.findOne({ email: email })
        .then(user => {
            if(user){
                errors.push({ msg: 'Email is already registered' });
                res.render('signup', { 
                    errors, 
                    name,
                    studentId, 
                    email, 
                    password, 
                    password2 
                });
            }
            else{
                const newUser = new User({
                    name,
                    studentId,
                    email,
                    password
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
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });

router.get('/logout', (req, res) => {
    req.logout();
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


module.exports = router;