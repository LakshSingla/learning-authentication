module.exports = {
	PORT         : process.env.PORT || 3000,
	SALT_ROUNDS  : 10,
	JWT_SECRET   : 'thisisasecret',
	DB_URL	     : 'mongodb://localhost:27017/learn-auth'
}
