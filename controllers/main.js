module.exports = function MainRoutes(app, db, passport) {
	app.get('/', isNotLoggedIn, function(req, res) {
	  res.render('main/index');
	});
	
	app.get('/signup', isNotLoggedIn, function(req, res) {
		res.render('users/signup', { error: req.flash('signupError') });
	});
	
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/users/profile',
		failureRedirect: '/signup',
		failureFlash: true
	}));
	
	app.get('/login', isNotLoggedIn, function(req, res) {
		res.render('users/login', { error: req.flash('loginError') });
	});
	
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/users/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));
	
	app.get('/users/profile', isLoggedIn, function(req, res) {
		res.render('users/profile', { message: req.flash('signup_login_Message') });
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	function isLoggedIn(req, res, next) {
		if (req.user)
			return next();

		res.redirect('/login');
	}

	function isNotLoggedIn(req, res, next) {
		if (!req.user)
			return next();

		res.redirect('/users/profile');
	}
};
