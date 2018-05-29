var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

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
router.get("/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

// ====================
//     CREATE CAMP
// ====================
router.post("/", isLoggedIn, function (req, res) {
    // get data from form
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id, 
        username: req.user.username
    }
    var newCampground = {
        name: name,
        image: image,
        description: description,
        author: author
    }
    // Add new campground and save to DB
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            console.log(newlyCreated);
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

// ====================
//      EDIT CAMP
// ====================
router.get("/:id/edit", function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            res.redirect("/campgrounds");
        }
        else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// ====================
//      UPDATE CAMP
// ====================
router.put("/:id", function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// ====================
//     DESTROY CAMP
// ====================
router.delete("/:id", function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
