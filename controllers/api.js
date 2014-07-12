var express = require('express');
var api_routes = express.Router();

var path = require('path');

var User = require(path.join(__basedir, 'models/user'));
var Task = require(path.join(__basedir, 'models/task'));
var Tasklist = require(path.join(__basedir, 'models/tasklist'));

////////////////////////////////////////////////////////////////////////
api_routes.get('/users', isLoggedIn, function(req, res) {
	var user = req.user;
	
	Task.find({_id: { $in: user.tasks}}, null, {sort:{completed:'asc', name:'asc'}}, function(err, tasks) {
		if (err)
			res.send(err);
		
		res.json(tasks);
	});
});

////////////////////////////////////////////////////////////////////////
api_routes.get('/users/tasklists', isLoggedIn, function(req, res) {
	var user = req.user;
	
	Tasklist.find({_id: { $in: user.tasklists}}, null, {sort:{name:'asc'}}, function(err, tasklists) {
		if (err)
			res.send(err);

		res.json(tasklists);
	});
});

////////////////////////////////////////////////////////////////////////
api_routes.post('/users/tasklists', isLoggedIn, function(req, res) {
	var user = req.user;

	Tasklist.create({
		name: req.body.name,
		color: req.body.color
	}, function(err, tasklist) {
		if (err)
			res.send(err);
			
		User.findById(req.user._id, function(err, user) {
			if (err)
				res.send(err);
				
			user.tasklists.push(tasklist._id);
			user.save(function(err) {
				if (err)
					res.send(err);

				Tasklist.find({_id: { $in: user.tasklists}}, null, {sort:{name:'asc'}}, function(err, tasklists) {
					if (err)
						res.send(err);

					res.json(tasklists);
				});
			});
		});
	});
});

////////////////////////////////////////////////////////////////////////
api_routes.delete('/users/tasklists/:_id', isLoggedIn, function(req, res) {
	var user = req.user;

	Tasklist.remove({
		_id: req.params._id
	}, function(err, tasklist) {
		if (err)
			res.send(err);
			
		User.findById(user._id, function(err, user) {
			if (err)
				res.send(err);
				
			user.tasklists.splice(user.tasklists.indexOf(tasklist._id), 1);
			user.save(function(err) {
				if (err)
					res.send(err);
					
				Tasklist.find({_id: { $in: user.tasklists}}, null, {sort:{name:'asc'}}, function(err, tasklists) {
					if (err)
						res.send(err);
						
					res.json(tasklists);
				});
			});
		});
	});
});

////////////////////////////////////////////////////////////////////////
api_routes.get('/users/tasks', isLoggedIn, function(req, res) {
	var user = req.user;
	
	Task.find({_id: { $in: user.tasks}}, null, {sort:{completed:'asc', name:'asc'}}, function(err, tasks) {
		if (err)
			res.send(err);
		
		res.json(tasks);
	});
});

////////////////////////////////////////////////////////////////////////
api_routes.post('/users/tasks', isLoggedIn, function(req, res) {
	var user = req.user;

	Task.create({
		name: req.body.name,
	}, function(err, task) {
		if (err)
			res.send(err);
			
		User.findById(req.user._id, function(err, user) {
			if (err)
				res.send(err);
				
			user.tasks.push(task._id);
			user.save(function(err) {
				if (err)
					res.send(err);

				Task.find({_id: { $in: user.tasks}}, null, {sort:{completed:'asc', name:'asc'}}, function(err, tasks) {
					if (err)
						res.send(err);

					res.json(tasks);
				});
			});
		});
	});
});

////////////////////////////////////////////////////////////////////////
api_routes.delete('/users/tasks/:_id', isLoggedIn, function(req, res) {
	var user = req.user;

	Task.remove({
		_id: req.params._id
	}, function(err, task) {
		if (err)
			res.send(err);
			
		User.findById(user._id, function(err, user) {
			if (err)
				res.send(err);
				
			user.tasks.splice(user.tasks.indexOf(task._id), 1);
			user.save(function(err) {
				if (err)
					res.send(err);
					
				Task.find({_id: { $in: user.tasks}}, null, {sort:{completed:'asc', name:'asc'}}, function(err, tasks) {
					if (err)
						res.send(err);
						
					res.json(tasks);
				});
			});
		});
	});
});

////////////////////////////////////////////////////////////////////////
api_routes.post('/users/tasks/togglecomplete/:_id', isLoggedIn, function(req, res) {
	var user = req.user;

	Task.findOne({
		_id: req.params._id
	}, function(err, task) {
		if (err)
			res.send(err);
			
		if (task.completed) {
			// to incomplete
			task.completed_date = undefined;
			task.completed_user_id = undefined;
			task.completed_user_name = undefined;
		} else {
			// to complete
			var d = new Date();
			
			task.completed_date = d;
			task.completed_user_id = req.user._id;
			task.completed_user_name = req.user.name;
		}
		
		task.completed = !task.completed;
		task.save(function(err) {
			if (err)
				res.send(err);
				
			Task.find({_id: { $in: user.tasks}}, null, {sort:{completed:'asc', name:'asc'}}, function(err, tasks) {
				if (err)
					res.send(err);
					
				res.json(tasks);
			});
		});
	});
});

	
////////////////////////////////////////////////////////////////////////
function isLoggedIn(req, res, next) {
	
	if (req.isAuthenticated())
//	if (req.user)
		return next();
		
	res.redirect('/');
}

module.exports = api_routes;
