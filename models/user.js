var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = mongoose.Schema({

	name: String,
	email: String,
	password: String,
	facebook: {
		id: String,
		token: String,
		name: String,
		email: String
	},
	tasklists: [ObjectId],
	tasks: [ObjectId]
});

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
