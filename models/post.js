const mongoose    = require('mongoose');

const Comment     = require('./comment');
const User        = require('./user');

const Schema      = mongoose.Schema;

let postSchema    = new Schema({
	author : {
		type: Schema.ObjectId,
		ref : 'User'
	},
	title  : String,
	body   : String,
	comments: [{
		type: Schema.ObjectId,
		ref : 'Comment'
	}],
	updatedAt: Date
});

postSchema.pre('save', function(next){
	this.updatedAt = new Date(); 
	next();
});

let Post = mongoose.model('Post', postSchema);

module.exports = Post;

