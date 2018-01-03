#LEARNING AUTHENTICATION

Main NPM Packages used
--Express as the API framework
--Mongoose database used to create models and store in mongoDB
--Bcrypt used to hash and compare the passwords
--Jsonwebtokens(JWT) *to be used* for authentication of private routes

ROUTES
--POST /register
	Accepts in JSON format 4 parameters : firstName, lastName, password, email
--POST /login
	Accepts in JSON format 2 parameters : password, email
