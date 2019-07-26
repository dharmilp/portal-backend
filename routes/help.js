const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAuthenticatedAdmin } = require('../config/auth');

router.get('/user',ensureAuthenticated, function(req, res, next) {
    res.render('userHelp');
});

router.get('/admin',ensureAuthenticatedAdmin, function(req, res, next) {
    
});

module.exports = router;