//Requiring the third party modules
const express      = require('express');
const mongoose     = require('mongoose');
const bodyParser   = require('body-parser');
const _ 	   = require('lodash');
const bcrypt       = require('bcrypt');

//Requiring the local modules
const CONFIG       = require('./config');
const User         = require('./models/user');
const authenticate = require('./authenticate')

//Configuring the required variables for the app
const app = express();
mongoose.Promise = global.Promise;
mongoose.connect(CONFIG.DB_URL, {
	useMongoClient: true
}).then(()=>{
	console.log('Connection established to the database');
});

app.use(bodyParser.json());





app.set('jwtSecret', CONFIG.JWT_SECRET );

app.get('/', (req, res) => {
	res.send('App route working perfectly');
});

app.post('/register', (req, res) => {
	console.log(req.body);
	yankedData = _.pick(req.body, ['firstName', 'lastName', 'password', 'email']);
	try{
		if(!_.has(yankedData, 'firstName') || !_.has(yankedData, 'lastName') ||!_.has(yankedData, 'password') ||!_.has(yankedData, 'email') )
			throw new Error("Insufficient parameters passed in the call");
	}catch(err){
		res.status(404).send(err.message);
		return;
	}
        var user = new User(yankedData);	
	user.save().then(doc => {
		console.log(doc);
		res.send({doc: doc, msg: "User added successfully"});
	}).catch(function(err){
		console.log(err);
		//res.status(404).send(err);
		if(err.code === 11000){
			res.status(404).send({
				msg : "Email is already taken"
			});
		}
	});
	//res.send("This route is working fine too");
});

app.post('/login', (req, res) => {
	yankedData = _.pick(req.body, ['password', 'email']);

	if(!_.has(yankedData, 'password') || !_.has(yankedData, 'email'))
		return res.status(401).send({status: 'Failed', msg: 'Insufficient data passed in body'});
	
	User.findOne({
		email : req.body.email
	}, function(err, result){
		if(err){
			res.status(404).send({
				status : 'failed',
				msg    : 'Unable to fulfil the query'
			});
			throw err;
			return;
		}
		if(!result){
			res.status(404).send({
				status : 'failed',
				msg    : 'Unable to find the user'
			});
			return;
		}
		if(bcrypt.compare(req.body.password, result.password, function(err, isValid){
			if(err){
				res.status(404).send({
					status : 'failed',
					msg    : 'Unable to hash the password'
				});
				return;
			}	
			if(!isValid){
				res.status(404).send({
					status : 'failed',
					msg    : 'Login failed, wrong password supplied'
				});
				return;
			}
			if(isValid){
				authenticate.supplyToken({
					id: result._id
				}).then(function(token){
					res.send({
						status : "passed",
						token  :  token
					});
				}).catch(function(err){
					res.status(404).send({
						status : "Failed",
						msg    : "Unable to supply the JWT"
					});
				});
				return;
			}
		}));
	});
});

	
app.listen(CONFIG.PORT, function(){
	console.log('App listening on http://localhost:'+CONFIG.PORT);
});
