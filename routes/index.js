var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");


//==========COMMON===================
//landing page
router.get("/", function(req, res) {
    res.render("landing");//转到landing页面，由于前面设置了view engine为ejs，这里不需要写成landing.ejs
});//这将在https://yelpcamp-demo-new-felicity.c9users.io这个页面显示

//==================auth routes=========================
// router.get("/register", function(req, res) {
//     res.render("register");
// });

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//for heroku

//handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    //User.register is provided by passport-local-mongoose pacakge
    User.register(newUser, req.body.password, function(err, user) {
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        } else {
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "welcome to yelpcamp" + user.username);
                res.redirect("/campgrounds");
            })
        }
    });
});


//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//handle login logic
//use passport.authenticate() middleware
//app.post("/login", middleware, callback)
//passport.authenticate()来解决验证username和password等复杂过程，不需要我们管
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
    
    });
    
//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "logged you out!!!!");
    res.redirect("/campgrounds");
});


//是否logged对于能否看到add comment很关键
//next的意思是前往下一个中间件
function isLoggedIn(req, res, next) {
    //如果true表示是login状态，则进行下一步动作，去往new campground或者new comment form
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;