const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAysnc =  require("../utils/wrapAysnc.js");
const reviewController = require("../controllers/reviews.js");

const {isLoggedIn,validateReview, isReviewAuthor} = require("../middleware.js");


//Review Rout
router.post("/", validateReview,isLoggedIn, wrapAysnc(reviewController.createReview));
 
 //DELETE review ROUTE
 router.delete("/:reviewId", isReviewAuthor, isLoggedIn, wrapAysnc(reviewController.destroyReview));

 module.exports = router; 