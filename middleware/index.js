var Campground = require('../models/campground');
var Comment = require('../models/comment');

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err || !foundCampground) {
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            } else if (foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    } 
    else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err || !foundComment) {
                req.flash("error", "Error!");
                res.redirect("back");
            } else if (foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
            console.log(req.params.comment_id);
        });
    }
    else {
        req.flash("error", "You must sign in first");
        res.redirect("/campgrounds/" + req.params.id);
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
<<<<<<< HEAD
    req.flash("error", "You need to be logged in first");
=======
>>>>>>> 2155557291ed1bbc949d5a703711ba790726233b
    res.redirect("/login");
}

module.exports = middlewareObj
