const mongoose    = require('mongoose');
const validator   = require('validator');

let userSchema = mongoose.Schema({
	firstName : {
		type         : String, 
		required     : true
	},
	lastName  : {
		type         : String,
		required     : true
	},
	password  : {
		type	     : String,
		required     : true
	},
	email     : {
		type         : String,
		required     : true,
		unique       : true,
		validator    : validator.isEmail
	}
});


let User   = mongoose.model('Users', userSchema );


module.exports = User;
