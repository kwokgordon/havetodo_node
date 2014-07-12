var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var tasklistSchema = mongoose.Schema({

	name: String,
	color: { type: String, default: "#000000" },
	tasks: [ObjectId]

});

module.exports = mongoose.model('Tasklist', tasklistSchema);
