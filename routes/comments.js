var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comments = require("../models/comments");
var middleware = require("../middleware/index.js");


//=============comments route==================
//NEW
//加上isLoggedIn作为middleware，这样true的话进行后面的function，false就返回login页面
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //create new comment
            Comments.create(req.body.comment, function(err, comment) {
                if(err) {
                    req.flash("error", "something went wrong");
                    console.log(err);
                } else {
                    //add a username and id to a comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "successfully added comments");
                    //redirect campground show page
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});


//comments edit routes
//campgrounds/:id/comments/:comments_id/edit
router.get("/:comment_id/edit", middleware.checkCommentsOwnership, function(req, res) {
    Comments.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
}); 


//comments update routes
//campgrounds/:id/comments/:comment_id
router.put("/:comment_id", middleware.checkCommentsOwnership, function(req, res) {
    Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//for heroku
//comments delete routes
router.delete("/:comment_id", middleware.checkCommentsOwnership, function(req, res) {
    Comments.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "successfully delete comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;