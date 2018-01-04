const _        = require('lodash');

const User     = require('./../models/user');
const Post     = require('./../models/post');

module.exports.getPostById = function(req, res){
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
};

module.exports.postMyPost = function(req, res){
    let yankedData = _.pick(req.body, ["title","body"]);
    if(!_.has(yankedData, 'body') || !_.has(yankedData, 'title'))
        return res.status(401).send({status: 'Failed', msg: 'Insufficient data passed in body'});
    let post = new Post({
        title  : req.body.title,
        body   : req.body.body,
        author : req.body.id
    });
    post.save().then(function(doc){
        User.findByIdAndUpdate(req.body.id, {
            $push : {
                posts : doc._id
            }
        }, function(err, user){
            if(err) {
                console.log(err);
                return;
            }
            res.send(doc);
        });
    }).catch(function(err){
        console.log(err);
        //Error handling if the document is unable to be saved
    }).catch(function(err){
        //Error handling if the query is unsuccessful
    });
};

