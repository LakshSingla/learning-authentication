//Requiring the third party modules
const express      = require('express');
const mongoose     = require('mongoose');
const bodyParser   = require('body-parser');

//Requiring the local modules
const CONFIG       = require('./config');
const auth_middleware = require('./auth-middleware');
const userVerifyControllers  = require('./controllers/user_verify');
const userControllers = require('./controllers/user_controller');
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

app.get('/comment/:id', commentControllers.getCommentById);

app.get('/user/:id', userControllers.getUserById);

//Protected routes, require the corresponding JWT in order to access them

app.use(auth_middleware);

//Test route for checking the working of jwt
app.use('/test-auth', function(req, res){
	res.send(req.body.id);
});

app.post("/me/post", postControllers.postMyPost);

app.post('/post/:id/comment', commentControllers.postCommentByPostId);

app.patch('/post/:id', postControllers.updatePostById);

app.delete('/post/:id', postControllers.deletePostById);

app.patch('/comment/:id', commentControllers.updateCommentById);

app.delete('/comment/:id', commentControllers.deleteCommentById);

app.listen(CONFIG.PORT, function(){
	console.log('App listening on http://localhost:'+CONFIG.PORT);
});