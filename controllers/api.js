var path = require('path');

var User = require(path.join(__basedir, 'models/user'));
var Task = require(path.join(__basedir, 'models/task'));
var Tasklist = require(path.join(__basedir, 'models/tasklist'));

module.exports = function APIRoutes(app, db, passport) {
	
	////////////////////////////////////////////////////////////////////////
	app.get('/api/users', isLoggedIn, function(req, res) {
		var user = req.user;
		
		Task.find({_id: { $in: user.tasks}}, null, {sort:{completed:'asc', name:'asc'}}, function(err, tasks) {
			if (err)
				res.send(err);
			
			return res.json({tasks : tasks});
		});
	});
	
	////////////////////////////////////////////////////////////////////////
	app.get('/api/users/tasklists', isLoggedIn, function(req, res) {
		var user = req.user;
		
		Tasklist.find({_id: { $in: user.tasklists}}, null, {sort:{name:'asc'}}, function(err, tasklists) {
			if (err)
				res.send(err);
	
			return res.json({tasklists : tasklists});
		});
	});
	
	////////////////////////////////////////////////////////////////////////
	app.post('/api/users/tasklists', isLoggedIn, function(req, res) {
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
	
						return res.json({tasklists : tasklists});
					});
				});
			});
		});
	});
	
	////////////////////////////////////////////////////////////////////////
	app.delete('/api/users/tasklists/:_id', isLoggedIn, function(req, res) {
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
							
						return res.json({tasklists : tasklists});
					});
				});
			});
		});
	});

	////////////////////////////////////////////////////////////////////////
	app.get('/api/users/tasklists/:tasklist_id', isLoggedIn, function(req, res) {
		var user = req.user;

		User.findById(user._id, function(err, user) {
			if (err)
				res.send(err);
			
			if(user.tasklists.indexOf(req.params.tasklist_id) == -1)
				return res.json({success:false, error: ["You don't have access to this tasklist."]});
				
			Tasklist.findById(req.params.tasklist_id, function (err, tasklist) {
				if (err)
					res.send(err);
				
				Task.find({_id: { $in: tasklist.tasks}}, null, {sort:{completed:'asc', name:'asc'}}, function(err, tasks) {
					if (err)
						res.send(err);
						
					return res.json({success: true, tasklist: tasklist._id, taskTitle: tasklist.name, tasks: tasks});
				});		
			});
		});		
	});
	
	////////////////////////////////////////////////////////////////////////
	app.get('/api/users/tasks', isLoggedIn, function(req, res) {
		var user = req.user;
		
		Task.find({_id: { $in: user.tasks}}, null, {sort:{completed:'asc', name:'asc'}}, function(err, tasks) {
			if (err)
				res.send(err);
			
			return res.json({tasklist: "all", taskTitle: "All Tasks", tasks : tasks});
		});
	});
	
	////////////////////////////////////////////////////////////////////////
	app.post('/api/users/tasks/:tasklist_id', isLoggedIn, function(req, res) {
		var user = req.user;
	
		Task.create({
			name: req.body.name,
		}, function(err, task) {
			if (err)
				res.send(err);
				
			User.findById(req.user._id, function(err, user) {
				if (err)
					res.send(err);
									
				if(req.params.tasklist_id != "all") {
					if(user.tasklists.indexOf(req.params.tasklist_id) == -1)
						return res.json({success:false, error: ["You don't have access to this tasklist."]});

					Tasklist.findById(req.params.tasklist_id, function (err, tasklist) {
						if (err)
							res.send(err);
						
						tasklist.tasks.push(task._id);
						tasklist.save(function(err) {
							if (err)
								res.send(err);
						});
					});
				}

				user.tasks.push(task._id);
				user.save(function(err) {
					if (err)
						res.send(err);
	
					Task.find({_id: { $in: user.tasks}}, null, {sort:{completed:'asc', name:'asc'}}, function(err, tasks) {
						if (err)
							res.send(err);
	
						return res.json({success: true, tasks : tasks});
					});
				});
			});
		});
	});
	
	////////////////////////////////////////////////////////////////////////
	app.delete('/api/users/tasks/:_id', isLoggedIn, function(req, res) {
		var user = req.user;
	
		Task.remove({
			_id: req.params._id
		}, function(err, task) {
			if (err)
				res.send(err);
				
			User.findById(user._id, function(err, user) {
				if (err)
					res.send(err);
					
				user.tasks.splice(user.tasks.indexOf(req.params._id), 1);
				user.save(function(err) {
					if (err)
						res.send(err);
						
					Task.find({_id: { $in: user.tasks}}, null, {sort:{completed:'asc', name:'asc'}}, function(err, tasks) {
						if (err)
							res.send(err);
							
						return res.json({tasks : tasks});
					});
				});
			});
		});
	});
	
	////////////////////////////////////////////////////////////////////////
	app.post('/api/users/tasks/togglecomplete/:_id', isLoggedIn, function(req, res) {
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
						
					return res.json({tasks : tasks});
				});
			});
		});
	});
	
		
	////////////////////////////////////////////////////////////////////////
	function isLoggedIn(req, res, next) {
		if (req.user)
			return next();

		res.redirect('/login');
	}

};