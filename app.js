var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  campgroundID: String,
  name: String,
  image: String,
  description: String
});

var userSchema = new mongoose.Schema({
  userID: String,
  email: String,
  password: String,
  name: String,
  username: String,
  city: String,
  state: String,
})

var commentSchema = new mongoose.Schema({
  commentID: String,
  userID: String,
  campgroundID: String,
  title: String
})

var Campground = mongoose.model("Campground", campgroundSchema);
var User = mongoose.model("User", userSchema);
var Comments = mongoose.model("Comments", commentSchema);

// Homepage routing
app.get("/", function(req, res) {
  res.render("landing");
});

// Campgrounds routing
app.get("/campgrounds", function(req, res) {
  // get all campgrounds from db
  Campground.find({}, function(err, allCampgrounds) {
    if(err) {
      console.log(err);
    }
    else {
      res.render("index", {campgrounds: allCampgrounds});
    }
  });
});

// Create new campground
app.post("/campgrounds", function(req, res) {
  // get data from form
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = {name: name, image: image, description: description};
  // Add new campground and save to DB
  Campground.create(newCampground, function(err, campground) {
    if(err) {
      console.log(err);
    }
    else {
      // redirect back to campgrounds page
      res.redirect("/campgrounds");
    }
  });
});

// New campgrounds routing
app.get("/campgrounds/new", function(req, res) {
  res.render("new.ejs");
});

app.get("/login", function(req, res) {
  res.render("login");
});

// Register routing
app.get("/register", function(req, res) {
  res.render("register");
});

// Create new user
app.post("/register", function(req, res) {
  // Capture the register fields
  var email = req.body.inputEmail;
  var password = req.body.inputPassword;
  var name = req.body.inputName;
  var username = req.body.inputUsername;
  var city = req.body.inputCity;
  var state = req.body.inputState;
  var newUser = {email: email, password: password, name: name, username: username, city: city, state: state};
  // Push register data to the database as a new username
  User.create(newUser, function(err, user) {
    if(err) {
      console.log(err);
    }
    else {
      res.redirect("/");
    }
  });
  // Redirect to the homepage
  res.redirect("/");
});

// Shows more info about the given campground
app.get("/campgrounds/:id", function(req, res) {
  // Find the campground with the given ID
  var campgroundID = req.params.id;
  Campground.findById(campgroundID, function(err, foundCampground) {
    if(err) {
      console.log(err);
    }
    else {
      // Render SHOW template for that ID
      res.render("show", {campground: foundCampground});
    }
  });
});

app.listen(3000, function() {
  console.log("Starting app...")
});
