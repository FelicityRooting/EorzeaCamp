var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comments");
//for heroku
var data = [
    {
        name: "sdjfkls", 
        image: "https://img2.finalfantasyxiv.com/accimg/a0/a1/a0a1dee626b29a5a8f84bc74357e47ed0ff3df57.jpg", 
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"    
    },
    {
        name: "aaaui", 
        image: "https://img2.finalfantasyxiv.com/accimg/7e/21/7e216c967f5dcb3583bc00aad4d9ec1d9c75c9c8.jpg", 
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "mkl", 
        image: "http://blog-imgs-64.fc2.com/e/r/i/eritto/ffxiv_20140215_185520.jpg", 
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
]
var data = [];


// function seedDB() {
//     //remove all campgrounds
//     Campground.remove({}, function(err) {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("removed campground!");
//             //add campgrounds
//             //loop through all data to create campgrounds for each one
//             //seed will represent 上面data里的某一条数据
//             data.forEach(function(seed) {
//                 Campground.create(seed, function(err, campground) {
//                     if(err) {
//                         console.log(err);
//                     } else {
//                         console.log("we've created a campground");
//                         //create a comment
//                         Comment.create({
//                             text: "this place is good!", 
//                             author: (
//                                 "123"
//                             )
//                         }, function(err, comment) {
//                             if(err) {
//                                 console.log(err);
//                             } else {
//                                 campground.comments.push(comment);
//                                 campground.save();
//                                 console.log("Created new comment");
//                             }
//                         });
//                     }
//                 });
//             });
//         }
//     });
//     //add comments
// }

function seedDB(){
   //Remove all campgrounds
   Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
            //add campgrounds
            //loop through all data to create campgrounds for each one
            //seed will represent 上面data里的某一条数据
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a campground");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;
