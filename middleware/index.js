var Spot = require("../models/spot");
var Review = require("../models/Review");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Spot.findById(req.params.id, function(err, foundSpot){
           if(err){
               req.flash("error", "SPOT NOT FOUND");
                res.redirect("back");
           } else {
                // Added this block, to check if foundSpot exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
                if(!foundSpot) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                // If the upper condition is true this will break out of the middleware and prevent the code below to crash our application
 
               if(foundSpot.author.id.equals(req.user._id)){
                next();
               } else {
                   req.flash("error", "you don't have permission to do that");
                 res.redirect("back");
               }
           }
        });
    } else {
        req.flash("error", "YOU DON'T HAVE PERMISSION TO DO THAT!!!");
        res.redirect("back");
    }
}

middlewareObj.checkReviewOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Review.findById(req.params.review_id, function(err, foundReview){
           if(err){
                res.redirect("back");
           } else {
                // Added this block, to check if foundSpot exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
                if(!foundReview){
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                // If the upper condition is true this will break out of the middleware and prevent the code below to crash our application
 
               if(foundReview.author.id.equals(req.user._id)){
                next();
               } else {
                   req.flash("error", "you do not have permission to do that!!");
                 res.redirect("back");
               }
           }
        });
    } else {
        req.flash("error", "you need to be logged in to do that!!");
        console.log("you need to be logged in to do that!!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "YOU NEED TO BE LOGGED IN FIRST TO DO THAT!!!");
    res.redirect("/login");
}

module.exports = middlewareObj;