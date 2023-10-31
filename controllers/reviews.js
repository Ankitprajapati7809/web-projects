const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createReview = async (req,resp)=>{
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id)
      let newReview = new Review(req.body.review);
 
      listing.reviews.push(newReview);
 
     await newReview.save();
     await listing.save();
     req.flash("success", "New Review Created!");
     resp.redirect(`/listings/${listing._id}`);
 };

 module.exports.destroyReview = async (req, resp)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
     await Review.findByIdAndDelete(reviewId);
     req.flash("success", "Review Deleted!");
    // console.log(deletedReview);
    resp.redirect(`/listings/${id}`);
};