var express = require("express");
var router = express.Router({mergeParams: true});
var passport   = require("passport");
var User       = require("../models/user");
//ROUTES.......
router.get("/", function(req, res){
    res.render("landing");
});

router.get("/register", function(req, res){
    res.render("register");
});
//handle sign up logic...
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
     if(err){
         req.flash("error", err.message);
         return res.render("register");
     }
     passport.authenticate("local")(req, res, function(){
         req.flash("success", "welcome to yelpcamp " + user.username);
         res.redirect("/spots");
     })
    });
});

// LOGIN ROUTES...

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
    successRedirect: "/spots",
    failureRedirect: "/login"
    }), function(req, res){
});


//log out route...
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!!!");
    res.redirect("/spots");
});



module.exports = router;