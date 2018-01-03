const mongoose     = require('mongoose');

const User         = require('./user');
const Post         = require('./post');

const Schema       = mongoose.Schema;

let commentSchema  = new Schema({
	originalPost   : {
		type   : Schema.ObjectId, 
		ref    : 'Post'
	},
	author         : {
		type   : Schema.ObjectId,
		ref    : 'User'
	},
	body           : String
});


module.exports     = mongoose.model('Comment',commentSchema) ;
