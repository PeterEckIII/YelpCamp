var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    methodOverride  = require('method-override');
    Campground      = require('./models/campground'),
    User            = require('./models/user.js')
    Comment         = require('./models/comment'),
    seedDB          = require('./seeds'),
    flash           = require('');
    

var commentRoutes       = require('./routes/comments'),
    campgroundRoutes    = require('./routes/campgrounds'),
    indexRoutes         = require('./routes/index');


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

// ================
//  MEHOD OVERRIDE
// ================
app.use(methodOverride("_method"));

// =====================
//    FLASH MESSAGES
// =====================
app.use(flash());

// ========================
// SETTING PUBLIC DIRECTORY
// ========================
app.use(express.static(__dirname + "/public"));

// ==================================
//   SETTING currentUser VARIABLE
// ==================================
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// ===============
// PASSPORT CONFIG
// ===============

app.use(require('express-session')({
  secret: "Puppies are cute",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ======================
//     ROUTE SETUP
// ======================

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// ====================================================================================================
//                                      LAUNCHING APP
// ====================================================================================================


app.listen(3000, function() {
  console.log("Starting app...")
});
