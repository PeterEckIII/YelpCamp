var express     = require("express"),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    Campground  = require('./models/campground');
    seedDB      = require("./seeds"),
    Comment    = require("./models/comment");

// ====================
// CONNECT TO MONGOOSE
// ====================
mongoose.connect("mongodb://localhost/yelp_camp");

// ==================
// BODY PARSER CONFIG
// ==================
app.use(bodyParser.urlencoded({extended: true}));

// ===============
// EJS VIEW ENGINE
// ===============
app.set("view engine", "ejs");

seedDB();
// var userSchema = new mongoose.Schema({
//   userID: String,
//   email: String,
//   password: String,
//   name: String,
//   username: String,
//   city: String,
//   state: String,
// })

// var User = mongoose.model("User", userSchema);

// ====================
//      HOMEPAGE
// ====================

app.get("/", function(req, res) {
  res.render("landing");
});

// ====================================================================================================
//                                         CAMP ROUTES
// ====================================================================================================


// ====================
//      INDEX CAMP
// ====================

app.get("/campgrounds", function(req, res) {
  // get all campgrounds from db
  Campground.find({}, function(err, allCampgrounds) {
    if(err) {
      console.log(err);
    }
    else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  });
});

// ====================
//      NEW CAMP
// ====================

app.get("/campgrounds/new", function (req, res) {
  res.render("campgrounds/new");
});

// ====================
//     CREATE CAMP
// ====================

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

// ====================
//      SHOW CAMP
// ====================

app.get("/campgrounds/:id", function(req, res) {
  // Find the campground with the given ID
  var campgroundID = req.params.id;
  Campground.findById(campgroundID).populate("comments").exec(function(err, foundCampground) {
    if(err) {
      console.log(err);
    }
    else {
      console.log("Found campground!");
      // Render SHOW template for that ID
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

// ====================================================================================================
//                                         USER ROUTES
// ====================================================================================================


// ====================
//      NEW USER
// ====================

app.get("/login", function (req, res) {
  res.render("users/login");
});

// Register routing
app.get("/register", function (req, res) {
  res.render("users/register");
});

// ====================
//    REGISTER USER
// ====================

app.post("/register", function (req, res) {
  // Capture the register fields
  var email = req.body.inputEmail;
  var password = req.body.inputPassword;
  var name = req.body.inputName;
  var username = req.body.inputUsername;
  var city = req.body.inputCity;
  var state = req.body.inputState;
  var newUser = {
    email: email,
    password: password,
    name: name,
    username: username,
    city: city,
    state: state
  };
  // Push register data to the database as a new username
  User.create(newUser, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/:username");
    }
  });
  // Redirect to the homepage
  res.redirect("/");
});

// ====================================================================================================
//                                         COMMENT ROUTES
// ====================================================================================================

//===================
//   NEW COMMENT
//===================

app.get("/campgrounds/:id/comments/new", function(req, res) {
  // Find campground by ID
  Campground.findById(req.params.id, function(err, campground) {
    if(err) {
      console.log(err);
    }
    else {
      res.render("comments/new", {campground: campground});
    }
  });
});

//===================
//  CREATE COMMENT
//===================

app.post("/campgrounds/:id/comments", function(req, res) {
  // Lookup campground using ID
  Campground.findById(req.params.id, function(err, campground) {
    if(err) {
      console.log(err);
      res.redirect("/campgrounds");
    }
    else {
      Comment.create(req.body.comment, function(err, comment) {
        if(err) {
          console.log(err);
        }
        else {
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

// ====================================================================================================
//                                      LAUNCHING APP
// ====================================================================================================


app.listen(3000, function() {
  console.log("Starting app...")
});
