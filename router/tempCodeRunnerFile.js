const express = require("express");
const router = express.Router();
const wrapAysnc =  require("../utils/wrapAysnc.js");
const Listing = require("../models/listing.js");
const { listingSchema }= require("../schema.js");
const ExpressError = require ("../utils/ExpressError");

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
         let errMsg = error.details.map((el) => el.message).join(",");
       throw new ExpressError(400, errMsg); 
    } else{
        next();
    }
};

router.get("/testListing", wrapAysnc(async(req, resp) => {
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By the beach",
        location: "Hazaribag, Goa",
        country: "India",
    });
    await sampleListing.save();
    console.log("sample was saved");
    resp.send("sucessful testing");
}));

// index Rout
router.get("/", wrapAysnc(async(req, res) =>{
    const allListings = await Listing.find({});
  res.render("listings/index.ejs", {allListings});

}));

// New Rout
router.get("/new",(req, resp) =>{
resp.render("listings/new");
})

// post Rout 
router.post("/", validateListing, wrapAysnc(async(req, resp,next)=>{
//    if(!req.body.listing){
//   throw new ExpressError(400, "send valid data for listing");
//    }
       let newListingData = req.body.listing;

    const newListing = new Listing({
        title: newListingData.title,
        description: newListingData.description,
        image: newListingData.image,
        price: newListingData.price,
        location: newListingData.location,
        country: newListingData.country,
    });
 
    await newListing.save();
    req.flash("success", "New Listing Created!");
        resp.redirect("/listings");
}));

// Show Rout
router.get("/:id", wrapAysnc(async (req, resp) =>{
      let {id} = req.params;
      const listing = await Listing.findById(id).populate("reviews");
      if(!listing){
        req.flash("error", "Listing Does not exsist!");
        resp.redirect("/listings");
      }
      resp.render("listings/show.ejs", {listing});
}))

// get edit Rout
router.get("/:id/edit", wrapAysnc(async (req, reps)=>{
       let {id} = req.params;
       const listing = await Listing.findById(id);
       reps.render("listings/edit", {listing});
}));

//PUT Rout
router.put("/:id",validateListing, wrapAysnc(async (req, resp) =>{

    let {id} = req.params;
     await Listing.findByIdAndUpdate(id,{...req.body.listing});
     req.flash("success", "Listing Updated!");
     resp.redirect("/listings");
}));

//DELETE ROUTE
router.delete("/:id", wrapAysnc(async (req, resp)=>{
      let {id} = req.params;
      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      req.flash("success", "Listing Deleted!");
      resp.redirect("/listings");
}));

module.exports = router;