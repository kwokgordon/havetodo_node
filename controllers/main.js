var express = require('express');
var main_routes = express.Router();

var passport = require('passport');
var path = require('path');

require(path.join(__basedir, 'config/passport.js'))(passport);

var User = require(path.join(__basedir, 'models/user'));
var Task = require(path.join(__basedir, 'models/task'));
var Tasklist = require(path.join(__basedir, 'models/tasklist'));

main_routes.get('/', function(req, res) {
  res.render('main/index.ejs');
});

main_routes.get('/signup', function(req, res) {
	res.render('users/signup.ejs', { message: req.flash('signupMessage') });
});

main_routes.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/users/tasks',
	failureRedirect: '/signup',
	failureFlash: true
}));

main_routes.get('/login', function(req, res) {
	res.render('users/login.ejs', { message: req.flash('loginMessage') });
});

main_routes.post('/login', passport.authenticate('local-login', {
	successRedirect: '/users/tasks',
	failureRedirect: '/login',
	failureFlash: true
}));

main_routes.get('/profile', isLoggedIn, function(req, res) {
	res.render('users/profile.ejs', {
		user: req.user // get the user out of session and pass to template
	});
});
	
main_routes.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});
	
function isLoggedIn(req, res, next) {
	
	if (req.isAuthenticated())
//	if (req.user)
		return next();
		
	res.redirect('/');
}

module.exports = main_routes;
