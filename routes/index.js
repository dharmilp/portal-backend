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

module.exports = router;