const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => res.render('welcome',{
    title: 'Welcome'        // title for page Welcome
}));
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard', {
    name: req.user.name,
    title: 'Dashboard'      // title for page Dashboard
}));

router.get('/admin', ensureAuthenticated, (req, res) => res.render('admin', {
    name: req.user.name,
    title: 'Admin Dashboard'      // title for page Admin Dashboard
}));

const Quiz = require('../models/Quiz');
router.get('/qi', (req, res) => {
    const id = '5cf3b2e8d497a12bfc651744';
    Quiz.findById(id)
    .exec((err,quiz) => {
        console.log(quiz);
        res.render('quizInstruction', {
            name: 'ff',
            title: 'qi',      // title for page Admin Dashboard
            quizinfo: quiz
        });
    })
});
module.exports = router;