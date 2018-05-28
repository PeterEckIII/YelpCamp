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
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
    // Create New Comment

    // Connect new comment to campground

    // Redirect to campground show page
});


module.exports = router;
