//Requiring the third party modules
const express      = require('express');
const mongoose     = require('mongoose');
const bodyParser   = require('body-parser');
const _ 	       = require('lodash');
// const bcrypt       = require('bcrypt');

//Requiring the local modules
const CONFIG       = require('./config');
const User         = require('./models/user');
const Post         = require('./models/post');
const Comment      = require('./models/comment');
const authenticate = require('./authenticate');
const auth_middleware = require('./auth-middleware');
const userVerifyControllers  = require('./controllers/user_verify');
const postControllers = require('./controllers/post_controller');
const commentControllers = require('./controllers/comment_controller');
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

app.post('/register', userVerifyControllers.register_controller);

app.post('/login', userVerifyControllers.login_controller);

app.get('/post/:id', postControllers.getPostById);

//Protected routes, require the corresponding JWT in order to access them

app.use(auth_middleware);

//Test route for checking the working of jwt
app.use('/test-auth', function(req, res){
	res.send(req.body.id);
});

app.post("/me/post", postControllers.postMyPost);

app.post('/post/:id/comment', commentControllers.postCommentByPostId);

app.listen(CONFIG.PORT, function(){
	console.log('App listening on http://localhost:'+CONFIG.PORT);
});
