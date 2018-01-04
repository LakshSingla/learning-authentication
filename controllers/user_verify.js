//Controller to check for registration and
const _        = require('lodash');
const bcrypt   = require('bcrypt');

const authenticate = require('./../authenticate');
const User     = require('./../models/user');

module.exports.register_controller = function(req, res){
    console.log(req.body);
    yankedData = _.pick(req.body, ['firstName', 'lastName', 'password', 'email']);
    try{
        if(!_.has(yankedData, 'firstName') || !_.has(yankedData, 'lastName') ||!_.has(yankedData, 'password') ||!_.has(yankedData, 'email') )
            throw new Error("Insufficient parameters passed in the call");
    }catch(err){
        res.status(404).send(err.message);
        return;
    }
    let user = new User(yankedData);
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
};

module.exports.login_controller = function(req, res) {
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
};