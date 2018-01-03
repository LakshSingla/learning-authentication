const mongoose    = require('mongoose');

const Schema      = mongoose.Schema;

let postSchema    = new Schema({
	author : {
		type: Schema.Types.ObjectId,
		ref : 'Users'
	}
	title  : String,
	body   : String,
	comment: {
		type: Schema.Types.ObjectId,
		ref : 'Comments'
	}
});

let Post = mongoose.model('Posts', postSchema);
