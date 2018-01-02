//Requiring the third party modules
const express      = require('express');
const mongoose     = require('mongoose');
const bodyParser   = require('body-parser');

//Requiring the local modules
const CONFIG = require('./config.js');

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
	res.send("This route is working fine too");
});

app.listen(CONFIG.PORT, function(){
	console.log('App listening on http://localhost:'+CONFIG.PORT);
});
