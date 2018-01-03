const mongoose     = require('mongoose');

const Schema       = mongoose.Schema;

let commentSchema  = new Schema({
	originalPost   : {
		type   : Schema.Types.ObjectId, 
		ref    : 'Posts'
	},
	author         : {
		type   : Schema.Types.ObjectId,
		ref    : 'Users'
	},
	body           : String
});


module.exports     = new Schema('Comments',commentSchema );
