const mongoose    = require('mongoose');
const validator   = require('validator');
const bcrypt      = require('bcrypt');

const 
     {SALT_ROUNDS}= require('./../config');

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
		lowercase    : true,
		validator    : validator.isEmail
	}
}, {
	runSettersOnQuery    : true
});

userSchema.pre('save', function(next){
	var user = this;
	if(!user.isModified('password'))
		return next();
	bcrypt.hash(user.password, SALT_ROUNDS, function(err, hash){
		if(err){
			return next(err);
		}
		user.password = hash;
		next();
	})	
});

let User   = mongoose.model('Users', userSchema );


module.exports = User;
