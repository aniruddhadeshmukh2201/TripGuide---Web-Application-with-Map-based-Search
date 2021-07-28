var express = require("express");
var router = express.Router({mergeParams: true});
var Spot = require("../models/spot");
// var Review    = require("../models/review");
var middleware = require("../middleware");
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const catchAsync = require('../utils/catchAsync');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

//INDEX - show all Spots
router.get("/", function(req, res){
    Spot.find({}, function(err, allSpots){
        if(err){
            console.log(err);
        } else {
            res.render("spots/index", {spots: allSpots, currentUser: req.user});
        }
    });
   });

//create
router.post("/",middleware.isLoggedIn, upload.array("image"), catchAsync(async (req, res) => {
    console.log(req.body);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    const spot = new Spot({
        name: req.body.name,
        location: req.body.location,
        description: req.body.description,
        price:req.body.price});
        spot.geometry = geoData.body.features[0].geometry;
        spot.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
        spot.author = {
        id: req.user._id,
        username: req.user.username
    }
    await spot.save();
    console.log(spot);
    req.flash('success', 'Successfully made a new spot!');
    res.redirect(`/spots/${spot._id}`)
}));
// router.post("/", upload.array("image"), (req, res) => {
//     console.log(req.body, req.files);
//     res.send(req.files);
// });

//NEW ROUTE
router.get("/new",middleware.isLoggedIn, function(req, res){
    res.render("spots/new");
});

// SHOW ROUTE
router.get("/:id", function(req, res){
    Spot.findById(req.params.id).populate("reviews").exec(function(err, foundSpot){
        if(err){
            console.log(err);
        } else {
            res.render("spots/show", {spot: foundSpot});
            // console.log(foundSpot, currentUser);
        }
    });
});
//edit route
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res){
    Spot.findById(req.params.id, function(err, foundSpot){
        res.render("spots/edit", {spot: foundSpot});
    });
});

//update route...
router.put("/:id",middleware.checkCampgroundOwnership,  upload.array("image"),catchAsync( async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const spot = await Spot.findByIdAndUpdate(id, { ...req.body.spot });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    spot.images.push(...imgs);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await spot.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }

    const geoData = await geocoder.forwardGeocode({
        query: req.body.spot.location,
        limit: 1
    }).send()
    spot.geometry = geoData.body.features[0].geometry;

    await spot.save();
    console.log(spot);
    req.flash('success', 'Successfully updated spot!');
    res.redirect(`/spots/${spot._id}`)
}));
// async (req, res) => {
//     Campground.findByIdAndUpdate(req.params.id,req.body.campground (err, updatedCampground){
//     const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
//     updatedCampground.images.push(...imgs);
//       if(err){
//           res.redirect("/campgrounds");
//       } else {
//           res.redirect("/campgrounds/" + req.params.id);
//       } 
//    }); 
// });


//delete route
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
    Spot.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/spots");
        } else {
            res.redirect("/spots");
        }
    })
});


module.exports = router;