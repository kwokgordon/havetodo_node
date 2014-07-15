var path = require('path');
var User = require(path.join(__basedir, 'models/user'));
var Task = require(path.join(__basedir, 'models/task'));
var Tasklist = require(path.join(__basedir, 'models/tasklist'));

var configAuth = require(path.join(__basedir, 'config/auth.js'));

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function PassportAuth(passport) {

	passport.serializeUser( function(user, done) {
		done(null, user.id);
	});
	
	passport.deserializeUser( function(id, done) {
		User.findById(id, function(err, user){
			done(err, user);
		});
	});
	
	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		
		process.nextTick( function() {
			User.findOne({ 'email': email }, function(err, user) {
				if (err)
					return done(err);
				
				if(req.body.password != req.body.password_confirmation)
					return done(null, false, req.flash('signupMessage', "Password confirmation doesn't match password."));
				
				if (user) {
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
				} else {
					var newUser = new User();
					
					newUser.name = req.body.name;
					newUser.email = email;
					newUser.password = newUser.generateHash(password);
					
					newUser.save( function(err) {
						if (err) 
							throw err;
						
						return done(null, newUser);
					});
				}
			});
		});
	}));
	
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		User.findOne({ 'email': email }, function(err, user) {
			if (err)
				return done(err);
				
			if (!user)
				return done(null, false, req.flash('loginMessage', 'No user found.'));
			
			if (!user.validPassword(password))
				return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
				
			return done(null, user);
		});
	}));
	
	
	passport.use(new FacebookStrategy({
		clientID : configAuth.facebookAuth.clientID,
		clientSecret : configAuth.facebookAuth.clientSecret,
		callbackURL : configAuth.facebookAuth.callbackURL
	},
	
	function(token, refreshToken, profile, done) {
		process.nextTick(function() {
			User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
				if (err)
					return done(err);
				
				if (user) {
					return done(null, user);
				} else {
					var newUser = new User();
					
					newUser.facebook.id = profile.id;
					newUser.facebook.token = token;
					newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
					newUser.facebook.email = profile.emails[0].value;
					
					newUser.save(function(err) {
						if (err)
							throw err;
							
						return done(null, newUser);
					});
				}
			});
		});
	}));
};
