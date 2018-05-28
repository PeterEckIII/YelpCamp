var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// ====================================================================================================
//                                         COMMENT ROUTES
// ====================================================================================================

//===================
//   NEW COMMENT
//===================

router.get("/new", isLoggedIn, function(req, res) {
    // Find campground by ID
    console.log(req.params.id);
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//===================
//  CREATE COMMENT
//===================

router.post("/", isLoggedIn, function (req, res) {
    // Lookup campground using ID
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    // Add username and ID to comment
                    // comment.author.id is from our comment.js model
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});


module.exports = router;
