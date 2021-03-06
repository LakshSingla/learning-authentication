const jwt        = require('jsonwebtoken');

const {JWT_SECRET} = require('./config');

module.exports.supplyToken = function(payload){
	return new Promise(function(resolve, reject){
		jwt.sign(payload, JWT_SECRET,{expiresIn : "1d"}, function(err, token){
			if(err){
				reject(err);
			}
			else{
				resolve(token);
			}
		})
	});	
};

module.exports.verifyToken = function(token){
	return new Promise(function(resolve, reject){
		jwt.verify(token, JWT_SECRET, {}, function(err, decoded){
			if(err){
				reject(err);
			}
			else{
				resolve(decoded);
			}
		});
	});
};
