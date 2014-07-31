var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({

	name: String,
	note: String,
	priority: { type: Number, default: 0 }, 
	due_date: Date, 
	due_time: Date,
	completed: { type: Boolean, default: false },
	completed_date: Date,
	completed_user_id: String,
	completed_user_name: String,
	comments: [{
		comment_user_id: String,
		comment_user_name: String,
		comment_date: Date,
		comment: String
	}]

});

module.exports = mongoose.model('Task', taskSchema);
