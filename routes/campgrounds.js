var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');

// ====================================================================================================
//                                         CAMP ROUTES
// ====================================================================================================


// ====================
//      INDEX CAMP
// ====================

router.get("/", function (req, res) {
    // get all campgrounds from db
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campgrounds: allCampgrounds,
                currentUser: req.user
            });
        }
    });
});

// ====================
//      NEW CAMP
// ====================

router.get("/new", function (req, res) {
    res.render("campgrounds/new");
});

// ====================
//     CREATE CAMP
// ====================

router.post("/", function (req, res) {
    // get data from form
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {
        name: name,
        image: image,
        description: description
    };
    // Add new campground and save to DB
    Campground.create(newCampground, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            // redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// ====================
//      SHOW CAMP
// ====================

router.get("/:id", function (req, res) {
    // Find the campground with the given ID
    var campgroundID = req.params.id;
    Campground.findById(campgroundID).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log("Found campground!");
            // Render SHOW template for that ID
            res.render("campgrounds/show", {
                campground: foundCampground
            });
        }
    });
});

module.exports = router;
