var express = require('express');
var task_routes = express.Router();

var path = require('path');

var User = require(path.join(__basedir, 'models/user'));
var Task = require(path.join(__basedir, 'models/task'));
var Tasklist = require(path.join(__basedir, 'models/tasklist'));

task_routes.get('/tasks', isLoggedIn, function(req, res) {
	var user = req.user;
	res.render('tasks/index.ejs', {
		user: user // get the user out of session and pass to template
	});
});

task_routes.get('/tasklists/:tasklist_id', isLoggedIn, function(req, res) {
	var user = req.user;

	User.findById(user._id, function(err, user) {
		if (err)
			res.send(err);
		
		if(user.tasklists.indexOf(req.params.tasklist_id) == -1)
			res.send("You don't have access to this tasklist.");
			
		res.render('tasklists/index.ejs', {
			user: user,
			tasklist_id: req.params.tasklist_id
		});
	});
});

function isLoggedIn(req, res, next) {
	
	if (req.isAuthenticated())
//	if (req.user)
		return next();
		
	res.redirect('/');
}

module.exports = task_routes;
