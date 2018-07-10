var express = require("express");
var router = express.Router();
var Cossite = require("../models/cossite");
var middleware = require("../middleware/index.js");
// var request = require("request");
// require('dotenv').config();

var multer = require('multer');
var storage = multer.diskStorage({
    
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})


var cloudinary = require('cloudinary');
cloudinary.config({ 
    cloud_name: 'dn3fbdr96', 
    api_key: 547756892641856, 
    api_secret: "jyadeXc25GVt45zIVAqM7muhGy8"
});

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
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
    // //get data from form and add to campgrounds array
    // var name = req.body.name;
    // var oricos = req.body.oricos;
    // var image = req.body.image;
    // var description = req.body.description;
    // var author = {
    //     id: req.user._id, 
    //     username: req.user.username
    // }
    // var newCos = {name: name, oricos: oricos, image: image, description: description, author: author};
    // //create a new campground into the database
    // Cossite.create(newCos, function(err, newlyCreated) {
    //     if(err) {
    //         console.log(err);
    //     } else {
    //         res.redirect("/cossite");
    //     }
    // });
    cloudinary.uploader.upload(req.file.path, function(result) {
        // add cloudinary url for the image to the campground object under image property
        req.body.cosimg.image = result.secure_url;
        // add author to campground
        req.body.cosimg.author = {
            id: req.user._id,
            username: req.user.username
        }
        Cossite.create(req.body.cosimg, function(err, cosimg) {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            res.redirect('/cossite/' + cosimg.id);
        });
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