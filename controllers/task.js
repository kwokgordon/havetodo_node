var path = require('path');

var User = require(path.join(__basedir, 'models/user'));
var Task = require(path.join(__basedir, 'models/task'));
var Tasklist = require(path.join(__basedir, 'models/tasklist'));

module.exports = function TaskRoutes(app, db, passport) {

	app.get('/users/tasks', isLoggedIn, function(req, res) {
		var user = req.user;
		res.render('tasks/index');
	});
	
	app.get('/users/tasklists/:tasklist_id', isLoggedIn, function(req, res) {
		var user = req.user;
	
		User.findById(user._id, function(err, user) {
			if (err)
				res.send(err);
			
			if(user.tasklists.indexOf(req.params.tasklist_id) == -1)
				res.send("You don't have access to this tasklist.");
				
			res.render('tasklists/index', {
				user: user,
				tasklist_id: req.params.tasklist_id
			});
		});
	});
	
	function isLoggedIn(req, res, next) {
		if (req.user)
			return next();

		res.redirect('/login');
	}
};
