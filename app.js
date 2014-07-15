var express = require('express');
var port = process.env.PORT || 3000;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoClient = require('mongodb').MongoClient;
var MongoServer = require('mongodb').Server;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var cons = require('consolidate');
var swig = require('swig');

var app = express();

global.__basedir = __dirname;

var configDB = require(path.join(__basedir, 'config/database.js'))(app.get('env'));
var configSecret = require(path.join(__basedir, 'config/secret.js'));

// configuration
//var mongoclient = new MongoClient(new MongoServer(configDB.host, configDB.port));
//var db = mongoclient.db(configDB.database);

MongoClient.connect(configDB.url, function(err, db) {
	"use strict";

	if (err) throw err;

	// configuration
	mongoose.connect(configDB.url);

	// pass passport for configuration
	var PassportAuth = require(path.join(__basedir, 'controllers/passport.js'));
	var passportauth = new PassportAuth(passport);

	// view engine setup
	app.engine('html', cons.swig);
	app.set('view engine', 'html');
	app.set('views', path.join(__basedir, 'views'));
	app.set('view cache', app.get('env') === 'production');
	swig.setDefaults({cache : app.get('env') === 'production'});

	app.use(favicon(path.join(__basedir, 'public/images/favicon.ico')));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded());
	app.use(cookieParser());
	app.use(session({ secret: configSecret.session.secret }));
	app.use(express.static(path.join(__basedir, 'public')));

	// required for passport
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
	app.use(function (req, res, next) {
		res.locals.login = req.isAuthenticated();
		res.locals.user = req.user;
		next();
	});


	//////////////////////////////////////////////////////////////////////////////
	// Routes
	
	var MainRoutes = require(path.join(__basedir, 'controllers/main'));
	var main_routes = new MainRoutes(app, db, passport);

	var TaskRoutes = require(path.join(__basedir, 'controllers/task'));
	var task_routes = new TaskRoutes(app, db, passport);

	var APIRoutes = require(path.join(__basedir, 'controllers/api'));
	var api_routes = new APIRoutes(app, db, passport);

//	app.use('/', main_routes);
//	app.use('/users', task_routes);
//	app.use('/api', api_routes);

	/////////////////////////////////////////////////////////////////////////////

	/// catch 404 and forward to error handler
	app.use(function(req, res, next) {
	    var err = new Error('Not Found');
	    err.status = 404;
	    next(err);
	});
	
	/// error handlers

	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
	    app.use(function(err, req, res, next) {
	        res.status(err.status || 500);
	        res.render('main/error', {
	            message: err.message,
	            error: err
	        });
	    });
	}

	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
	    res.status(err.status || 500);
	    res.render('main/error', {
	        message: err.message,
	        error: {}
	    });
	});
	
	console.log('Express app on port: ' + port);
	
});

module.exports = app;
