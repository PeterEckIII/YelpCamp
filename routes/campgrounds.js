var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var middleware = require('../middleware') // Don't need the filename because it's "special" by naming it index.js 

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
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

// ====================
//     CREATE CAMP
// ====================
router.post("/", middleware.isLoggedIn, function (req, res) {
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
            req.flash("error", "There was an error creating your campground");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground created!");
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
        if (err || !foundCampground) {
            req.flash("error", "Campground cannot be found");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/show", {campground: foundCampground});
    });
});

// ====================
//      EDIT CAMP
// ====================
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err || !foundCampground) {
            req.flash("error", "There was a problem loading the page");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// ====================
//      UPDATE CAMP
// ====================
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            req.flash("error", "Can't update your campground");
            res.redirect("/campgrounds/" + req.params.id);
        } 
        else if (!updatedCampground) {
            req.flash("error", "Cannot find that campground");
            res.redirect("back");
        }
        else {
            req.flash("success", "Campground updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// ====================
//     DESTROY CAMP
// ====================
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/campgrounds");
        }
        else {
            req.flash("success", "Campground deleted");
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;
