var express = require('express');
var router = express.Router();

// login
router.get('/login',(req, res) => res.render('login'));
// Register
router.get('/signup',(req, res) => res.render('signup'));

module.exports = router;
