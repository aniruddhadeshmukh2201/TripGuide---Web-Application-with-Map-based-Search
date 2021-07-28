if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Spot = require("./models/spot"),
    flash      = require("connect-flash"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    User       = require("./models/user"),
    methodOverride = require("method-override"),
    Review    = require("./models/review"),
    seedDb     = require("./seeds")
    
var reviewRoutes    = require("./routes/reviews"),
    spotRoutes = require("./routes/spots"),
    authRoutes       = require("./routes/index")

mongoose.connect("mongodb://localhost/yelp_camp_v12", { useNewUrlParser: true, useUnifiedTopology: true  });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// seedDb();
app.use(methodOverride("_method"));
app.use(flash());


//PASSPORT CONFIGURATION...
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user || null;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", authRoutes);
app.use("/spots", spotRoutes);
app.use("/spots/:id/reviews", reviewRoutes);

var server = app.listen(8000, process.env.IP, function(){
    console.log("yelpCamp server has started!!");
});
module.exports = server