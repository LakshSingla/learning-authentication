//Requiring the third party modules
const express      = require('express');
const mongoose     = require('mongoose');
const bodyParser   = require('body-parser');
const _ 	   = require('lodash');
const bcrypt       = require('bcrypt');

//Requiring the local modules
const CONFIG       = require('./config');
const User         = require('./models/user');
const Post         = require('./models/post');
const Comment      = require('./models/comment');
const authenticate = require('./authenticate');

//Configuring the required variables for the app
const app = express();
mongoose.Promise = global.Promise;
mongoose.connect(CONFIG.DB_URL, {
	useMongoClient: true
}).then(function(){
	console.log('Connection established to the database');
});

app.use(bodyParser.json());





app.set('jwtSecret', CONFIG.JWT_SECRET );

app.get('/', function(req, res){
	res.send('App route working perfectly');
});

app.post('/register', function(req, res){
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
	user.save().then(function(doc){
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

app.post('/login', function(req, res) {
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
		bcrypt.compare(req.body.password, result.password, function(err, isValid){
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
		});
	});
});

app.get('/post/:id', function(req, res){
    // console.log(req.params.id);
    Post.findById(req.params.id).then(function (post) {
        if(!post){
            //Error handling if the post was not found
            return;
        }
        res.send({
            status : "passed",
            post   : post
        });
    }).catch(function (err) {
        //Error handling if the query fails
        return;
    });

});

//Protected routes, require the corresponding JWT in order to access them

app.use(function(req, res, next){
	let token = req.header('x-auth-jwt');
	authenticate.verifyToken(token).then(function(decoded){
	    User.findById(decoded.id).then(function(doc){
	        if(!doc){
	            //Error handling when the user is not found in the list
	            return;
            }
            req.body.id = decoded.id;
            next();
        }).catch(function (err) {
            //Error handling when the query is not fulfilled
        });

	}).catch(function(err){
		if(err.name === "TokenExpiredError"){
			res.status(404).send({
				status  : "failed",
				msg     : "JWT expired, please login again to get a new token"
			});
			return;
		}
		res.status(404).send({
				status  : "failed",
				msg     : "Unable to authorise the token please login again"
			});
		
	});	
});

//Test route for checking the working of jwt
app.use('/test-auth', function(req, res){
	res.send(req.body.id);
});

app.post("/me/post", function(req, res){
	let yankedData = _.pick(req.body, ["title","body"]);
	if(!_.has(yankedData, 'body') || !_.has(yankedData, 'title'))
		return res.status(401).send({status: 'Failed', msg: 'Insufficient data passed in body'});
		var post = new Post({
			title  : req.body.title,
			body   : req.body.body,
			author : req.body.id
		});
		post.save().then(function(doc){
			res.send(doc);
		}).catch(function(err){
			console.log(err);
			//Error handling if the document is unable to be saved
		}).catch(function(err){
    //Error handling if the query is unsuccessful
	});
});

app.post('/post/:id/comment', function (req, res) {
    postId = req.params.id;
    Post.findById(postId).then(function(post){
        if(!post){
            //Error handling when post is not found
            return;
        }
        if(!_.has(req.body, ["body"])){
            //Error handling when the request doesnot contain any body
            return;
        }
        let comment = new Comment({
            post   : post._id,
            author : req.body.id,
            body   : req.body.body
        });
        comment.save().then(function (doc) {
            res.send({
                status  : "passed",
                doc     : doc
            });
            return;
        }).catch(function (err) {
            //Error handling if the post is unable to be saved
        });
    }).catch();
});
	
app.listen(CONFIG.PORT, function(){
	console.log('App listening on http://localhost:'+CONFIG.PORT);
});
