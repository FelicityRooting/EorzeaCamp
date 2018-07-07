//all middleware go here
//start
var Campground = require("../models/campground");
var Comments = require("../models/comments");

var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    //is user logged in ?(define our own middleware, so we're going to combine 
    //that functionality instead of this middleware(即下面的isLoggedIn))
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err) {
                req.flash("error", "campgrounds not found");
                //if err, redirect somewhere came before
                res.redirect("back");
            } else {
                //does this user own the campground
                // console.log(req.user._id);//string
                // console.log(foundCampground.author.id);//not string, mongoose object
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();//在update，edit，delete中有不同的执行
                } else {
                    req.flash("error", "you don't have permission to do that");
                    //if not, redirect somewhere came before
                    res.redirect("back");
                }
            }
        });
    } else {
        //if not, redirect somewhere came before 
        req.flash("error", "you need to log in first!");
        res.redirect("back");
    }
}


middlewareObj.checkCommentsOwnership = function(req, res, next) {
    //is user logged in ?(define our own middleware, so we're going to combine 
    //that functionality instead of this middleware(即下面的isLoggedIn))
    if(req.isAuthenticated()) {
        Comments.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                //if err, redirect somewhere came before
                res.redirect("back");
            } else {
                //does this user own the comments?
                // console.log(req.user._id);//string
                // console.log(foundCampground.author.id);//not string, mongoose object
                if(foundComment.author.id.equals(req.user._id)) {
                    next();//在update，edit，delete中有不同的执行
                } else {
                    req.flash("error", "you don't have permission to do that!!");
                    //if not, redirect somewhere came before
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "you need to log in");
        //if not, redirect somewhere came before 
        res.redirect("back");
    }
}


//middleware define
//是否logged对于能否看到add comment很关键
//next的意思是前往下一个中间件
middlewareObj.isLoggedIn = function(req, res, next) {
    //如果true表示是login状态，则进行下一步动作，去往new campground或者new comment form
    if(req.isAuthenticated()) {
        return next();
    } else {
        //it gives us a way of accessing this on the next request
        //in the flash, add please login first for the next request and the redirect to "/login"
        //the we need to handle that in "/login"
        req.flash("error", "Please login first");
        res.redirect("/login");
    }
}

module.exports = middlewareObj;