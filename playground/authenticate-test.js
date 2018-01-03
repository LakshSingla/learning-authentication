const authenticate     = require('./../authenticate');

authenticate.supplyToken({
	hi : 'Hello'
}).then(function(token){
	console.log(token);
});

authenticate.verifyToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoaSI6IkhlbGxvIiwiaWF0IjoxNTE0OTczMDg3LCJleHAiOjE1MTUwNTk0ODd9.acuTx60zxovHAFQdUNzergCIDiVXUz3GBy9j-_pjKWQ'
).then(function(decoded){
	console.log(decoded);
}).catch(function(err){
	console.log(err);
});
