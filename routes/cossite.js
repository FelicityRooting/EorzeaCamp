var express = require("express");
var router = express.Router();
var Cossite = require("../models/cossite");
var middleware = require("../middleware/index.js");

//index
router.get("/", function(req, res) {
    //get all campgrounds from db
    Cossite.find({}, function(err, allCossites) {
        if(err) {
            console.log(err);
        } else {
            res.render("cosplay/cossites", {cossites: allCossites, page: 'cossites'});
        }
    })
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var oricos = req.body.oricos;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id, 
        username: req.user.username
    }
    var newCos = {name: name, oricos: oricos, image: image, description: description, author: author};
    //create a new campground into the database
    Cossite.create(newCos, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            //此处的campgrounds指的是var campgrounds = []建立的array
            //campgrounds.push(newCampgrounds);//push a new campground to campgrounds array
            
            //redirect to the campgrounds page
            res.redirect("/cossite");
        }
    });
});

//NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //create new campgrounds
    //show/render the form that pass from app.post("/campgrounds")
    res.render("cosplay/new");
});

//SHOW
router.get("/:id", function(req, res) {
    //find the campground with the provided id
    //populate用法: lets you reference documents in other collections.
    //先找id，有Campground.findById(req.params.id)，然后查询从models/campgrounds.js里的comments，执行query we made
    Cossite.findById(req.params.id).populate("coscomments").exec(function(err, foundCossite) {
        if(err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render("cosplay/show", {cosimg: foundCossite});
        }
    });
});

//edit cos routes
router.get("/:id/edit", middleware.checkCosplay, function(req, res) {
    //这里的err不需要重复handle
    Cossite.findById(req.params.id, function(err, foundCossite) {
        res.render("cosplay/edit", {cosimg: foundCossite});    
    }); 
});


//update cos routes
router.put("/:id", middleware.checkCosplay, function(req, res) {
    //find and update the correct campground
    Cossite.findByIdAndUpdate(req.params.id, req.body.cosimg, function(err, updatedCosplay) {
        if(err) {
            res.redirect("/cossite");
        } else {
            res.redirect("/cossite/" + req.params.id);
        }
    });
});

//destroy cos routes
router.delete("/:id", middleware.checkCosplay, function(req, res) {
    Cossite.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/cossite");
        } else {
            res.redirect("/cossite");
        }
    });
});


module.exports = router;