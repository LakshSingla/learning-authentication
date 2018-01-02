//Requiring the third party modules
const express      = require('express');
const mongoose     = require('mongoose');
const bodyParser   = require('body-parser');
const _ 	   = require('lodash');

//Requiring the local modules
const CONFIG       = require('./config.js');
const User         = require('./models/user.js');

//Configuring the required variables for the app
const app = express();
mongoose.Promise = global.Promise;
mongoose.connect(CONFIG.DB_URL, {
	useMongoClient: true
}).then(()=>{
	console.log('Connection established to the database');
});

app.use(bodyParser.json());







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

app.listen(CONFIG.PORT, function(){
	console.log('App listening on http://localhost:'+CONFIG.PORT);
});
