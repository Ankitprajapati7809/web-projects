const express = require("express");
const router = express.Router();
const wrapAysnc =  require("../utils/wrapAysnc.js");
const {isLoggedIn , isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
.route("/")
// index Rout
.get(wrapAysnc(listingController.index))
// post Rout 
.post( isLoggedIn, upload.single('listing[image]'), validateListing,  wrapAysnc(listingController.postListing));

// New Rout
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
.route("/:id")
// Show Rout
.get( wrapAysnc(listingController.showListings))

//PUT Rout
.put( isLoggedIn, isOwner, upload.single('listing[image]'),validateListing,  wrapAysnc(listingController.putListings))
  
//DELETE ROUTE
.delete( isLoggedIn, isOwner, wrapAysnc(listingController.destroyListings));


// get edit Rout
router.get("/:id/edit", isLoggedIn, isOwner, wrapAysnc(listingController.renderEditForm))



module.exports = router;



