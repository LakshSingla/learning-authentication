const User = require('./models/user');
const authenticate = require('./authenticate');

module.exports = function(req, res, next){
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
};