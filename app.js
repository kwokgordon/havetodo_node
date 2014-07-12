var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

global.__basedir = __dirname;

var configDB = require(path.join(__basedir, 'config/database.json'))[app.get('env')];

// configuration
mongoose.connect(configDB.url);

// pass passport for configuration
require(path.join(__basedir, 'config/passport.js'))(passport);

// view engine setup
app.set('views', path.join(__basedir, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__basedir, 'public/images/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'havetodosecret' }));
app.use(express.static(path.join(__basedir, 'public')));

// required for passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req, res, next) {
	res.locals.login = req.isAuthenticated();
	next();
});

//////////////////////////////////////////////////////////////////////////////
// Models

var User = require(path.join(__basedir, 'models/user'));
var Task = require(path.join(__basedir, 'models/task'));
var Tasklist = require(path.join(__basedir, 'models/tasklist'));

//////////////////////////////////////////////////////////////////////////////
// Routes
var main_routes = require(path.join(__basedir, 'controllers/main'))
var task_routes = require(path.join(__basedir, 'controllers/task'))
var api_routes = require(path.join(__basedir, 'controllers/api'))

app.use('/', main_routes);
app.use('/users', task_routes);
app.use('/api', api_routes);

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
        res.render('main/error.ejs', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('main/error.ejs', {
        message: err.message,
        error: {}
    });
});

console.log('Express app on port: ' + port);

module.exports = app;
