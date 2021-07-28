var express = require("express");
var router = express.Router({mergeParams: true});
var Spot = require("../models/spot");
var Review    = require("../models/review");
var middleware = require("../middleware");

router.get("/new",middleware.isLoggedIn, function(req, res){
    Spot.findById(req.params.id, function(err, spot){
        if(err){
            console.log(err);
        } else {
           res.render("reviews/new", {spot: spot}); 
        }
    });
    
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Spot.findById(req.params.id, function(err, spot){
        if(err){
            console.log(err);
            res.redirect("/spots");
        } else {
            Review.create(req.body.review, function(err, review){
                if(err){
                    req.flash("error", "something went wrong!");
                    console.log(err);
                } else {
                    //add username and id to the review
                    review.author.id = req.user._id;
                    review.author.username = req.user.username;
                    review.save();
                    spot.reviews.push(review);
                    spot.save();
                    req.flash("success", "successfully added review");
                    res.redirect('/spots/'+ req.params.id);
                }
            });
        }
    });
});


//edit route...
router.get("/:review_id/edit",middleware.checkReviewOwnership, function(req, res){
    Review.findById(req.params.review_id, function(err, review){
        if(err){
            res.redirect("back");
        } else {
            res.render("reviews/edit", {spot_id: req.params.id, review});
        }
    });
});

//update route...
router.put("/:review_id", middleware.checkReviewOwnership, function(req, res){
    Review.findByIdAndUpdate(req.params.review_id, req.body.review, function(err, updatedReview){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/spots/" + req.params.id);
       }
    });
});

//destroy route
router.delete("/:review_id",middleware.checkReviewOwnership, function(req, res){
    Review.findByIdAndRemove(req.params.review_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Review deleted");
            res.redirect("/spots/" + req.params.id);
        }
    });
});
module.exports = router;