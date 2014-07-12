var path = require('path');
var configSecret = require(path.join(__basedir, 'config/secret.js'));

module.exports = function(env){
	switch(env){
		case 'development':
			return {
				"url": "mongodb://localhost:27017/havetodo",
				"host":"localhost",
				"port":27017,
				"database":"havetodo"
			};
		case 'production':
			return {
				"url": "mongodb://localhost:27017/havetodo",
				"host":"localhost",
				"port":27017,
				"database":"havetodo"
			};
		default:
			return {
				"url": "error",
				"host":"error",
				"port":"error",
				"database":"error",
				"error" : "error"
			};
    }
};
