const _        = require('lodash');

const User     = require('./../models/user');
const Post     = require('./../models/post');
const Comment  = require('./../models/comment');

module.exports.postCommentByPostId =  function (req, res) {
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
            User.findByIdAndUpdate(req.body.id, {
                $push : {
                    comments : doc._id
                }
            }).then(function(user){
                res.send({
                    status  : "passed",
                    doc     : doc
                });
            }).catch();
            return;
        }).catch(function (err) {
            //Error handling if the post is unable to be saved
            return;
        });
    }).catch(function(){
        //Error handling if the query to find the post has failed
        return;
    });
};