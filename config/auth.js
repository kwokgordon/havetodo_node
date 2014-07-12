var path = require('path');
var configSecret = require(path.join(__basedir, 'config/secret.js'));

module.exports = {
	
	'facebookAuth' : {
		'clientID': configSecret.facebookAuth.clientID,
		'clientSecret': configSecret.facebookAuth.clientSecret,
		'callbackURL': configSecret.facebookAuth.callbackURL
	}
	
};