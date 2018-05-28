var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

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
            console.log(err);
            return res.render("users/register");
        }
        passport.authenticate("local")(req, res, function () {
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
}), function (req, res) {});

// ================
//     LOGOUT
// ================

router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/campgrounds")
});



module.exports = router
