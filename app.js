var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    flash           = require('connect-flash'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    methodOverride  = require('method-override');
    Campground      = require('./models/campground'),
    User            = require('./models/user.js')
    Comment         = require('./models/comment');
    

var commentRoutes       = require('./routes/comments'),
    campgroundRoutes    = require('./routes/campgrounds'),
    indexRoutes         = require('./routes/index');


// ====================
// CONNECT TO MONGOOSE
// ====================
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url);

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

// ===============
// FLASH MESSAGES
// ===============
app.use(flash());

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


app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// ======================
//     ROUTE SETUP
// ======================

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// ====================================================================================================
//                                      LAUNCHING APP
// ====================================================================================================


app.listen(process.env.PORT || 3000, function() {
  console.log("Starting app...")
});
