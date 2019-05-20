const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


const User = require('../models/User');

router.get('/login', (req, res) => res.render('login'));
router.get('/signup', (req, res) => res.render('signup'));

router.post('/signup', (req, res) => {
    const { name, studentId, email, password, password2 } = req.body;
    let errors = [];

    if(!name || !studentId || !email || !password || !password2)
    {
        errors.push({ msg: 'Please fill all the fields' });
    }

    if(password!==password2)
    {
        errors.push({ msg: 'Password do not match' });
    }

    if(password.length < 6)
    {
        errors.push({ msg: 'Password should be atleast 6 characters' });
    }

    if(errors.length > 0)
    {
        res.render('signup', { 
            errors, 
            name, 
            email, 
            password, 
            password2 
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

module.exports = router;