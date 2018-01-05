
const User     = require('./../models/user');

module.exports.getUserById = function (req, res) {
    User.findById(req.params.id).populate('posts').populate('comments').then(function (user) {
        if(!user){
            //Error handling if the user is not found
            return;
        }
        res.send({
            msg   : "passed",
            user  : user
        });
    }).catch(function(err){
        //Error handling if the query fails to run
    });
};