const Listing = require("../models/listing.js");

module.exports.index = async(req, res) =>{
    const allListings = await Listing.find({});
  res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, resp) =>{
    // console.log(req.user);
resp.render("listings/new");
};

module.exports.postListing = async(req, resp,next)=>{
    //    if(!req.body.listing){
    //   throw new ExpressError(400, "send valid data for listing");
    //    }
        let url = req.file.path;
        let filename = req.file.filename;
      

        let newListingData = req.body.listing;
        const newListing = new Listing({
            title: newListingData.title,
            description: newListingData.description,
            image: newListingData.image,
            price: newListingData.price,
            location: newListingData.location,
            country: newListingData.country,
    
        });
        newListing.owner = req.user._id;
        newListing.image = {url,filename};
        await newListing.save();

        req.flash("success", "New Listing Created!");
        resp.redirect("/listings");
    };

module.exports.showListings = async (req, resp) =>{
        let {id} = req.params;
        const listing = await Listing.findById(id).populate("reviews").populate("owner");
        if(!listing){
          req.flash("error", "Listing Does not exsist!");
          resp.redirect("/listings");
        }
      //   console.log(listing);
        resp.render("listings/show.ejs", {listing});
  };

module.exports.renderEditForm = async(req, resp)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    // if(!listing){
    //     req.flash("error", "Listing you are requested does not exist!");
    //     resp.redirect("/listings");
    // }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    resp.render("listings/edit.ejs", {listing ,originalImageUrl}); 

};

module.exports.putListings = async (req, resp) =>{
    let {id} = req.params;
    // await Listing.findByIdAndUpdate(id,{...req.file.listing});
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
     
    if(typeof req.file !== "undefined"){
     let url = req.file.path;
     let filename = req.file.filename;
     listing.image = {url,filename};
     await listing.save();
    }
     req.flash("success", "Listing Updated!");
     resp.redirect(`/listings/${id}`);
   
};

module.exports.destroyListings = async (req, resp)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    resp.redirect("/listings");
}