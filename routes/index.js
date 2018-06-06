var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// ====================
//      HOMEPAGE
// ====================
router.get("/", function (req, res) {
    res.render("landing");
});

// ================================================================================
//                                    AUTH ROUTES
// ================================================================================

// ================
//  REGISTER FORM
// ================
router.get("/register", function (req, res) {
    res.render("users/register");
});

// ================
//  REGISTER POST
// ================
router.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to Camp Bug, " + user.username);
            res.redirect("/campgrounds");
        });
    });
});


// ================
//   LOGIN FORM
// ================
router.get("/login", function (req, res) {
    res.render("./users/login");
});

// ================
//   LOGIN POST
// ================
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {
    req.flash("success", "Successfully logged you in!");
});

// ================
//     LOGOUT
// ================
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/campgrounds")
});



module.exports = router
