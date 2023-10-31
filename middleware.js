const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema}= require("./schema.js");



module.exports.isLoggedIn = (req,resp,next)=>{
    console.log(req.user);
    if(req.isUnauthenticated()){
        req.flash("error","you have to logged in first!");
         return resp.redirect("/login");
    }
    next();
};

module.exports.isOwner = async(req,resp,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(resp.locals.currUser._id)){
        req.flash("error","You are not the owner!");
       return resp.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async(req,resp,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(resp.locals.currUser._id)){
        req.flash("error","You are not the owner!");
       return resp.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
         let errMsg = error.details.map((el) => el.message).join(",");
       throw new ExpressError(400, errMsg); 
    } else{
        next();
    }
};

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
         let errMsg = error.details.map((el) => el.message).join(",");
       throw new ExpressError(400, errMsg); 
    } else{
        next();
    }
};