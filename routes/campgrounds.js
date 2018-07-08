var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");


//INDEX
//campgrounds route, this will shows all the campground we have. Each campground has a name and image

// router.get("/", function(req, res) {
//     //get all campgrounds from db
//     Campground.find({}, function(err, allCampgrounds) {
//         if(err) {
//             console.log(err);
//         } else {
//             res.render("campgrounds/campgrounds", {campgrounds: allCampgrounds, currentUser: req.user});//上面的数据传入了campgrounds页面，转到campgrounds页面，第二个参数是all the data we want pass through
//             //第二个是campgrounds是data we pass in，第一个campgrounds是the name we want to give it,可以任意命名
//         }
//     })
// });

//for heroku
router.get("/", function(req, res) {
    //get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/campgrounds", {campgrounds: allCampgrounds, page: 'campgrounds'});//上面的数据传入了campgrounds页面，转到campgrounds页面，第二个参数是all the data we want pass through
            //第二个是campgrounds是data we pass in，第一个campgrounds是the name we want to give it,可以任意命名
        }
    })
});


//CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id, 
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: description, author: author};
    //create a new campground into the database
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            //此处的campgrounds指的是var campgrounds = []建立的array
            //campgrounds.push(newCampgrounds);//push a new campground to campgrounds array
            
            //redirect to the campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //create new campgrounds
    //show/render the form that pass from app.post("/campgrounds")
    res.render("campgrounds/new");
});

//SHOW
router.get("/:id", function(req, res) {
    //find the campground with the provided id
    //populate用法: lets you reference documents in other collections.
    //先找id，有Campground.findById(req.params.id)，然后查询从models/campgrounds.js里的comments，执行query we made
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//edit campground routes
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    //这里的err不需要重复handle
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});    
    }); 
});


//update campground routes
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    // var data = {
    //     name: req.body.name,
    //     image: req.body.image,
    //     description: req.body.description
    // }
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//destroy campground routes
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;