if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./router/listing.js");
const reviewsRouter = require("./router/review.js");
const userRouter = require("./router/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("connected to DB");
    })
 .catch((err) =>{
    console.log(err);
 });


async function main(){
    await mongoose.connect(dbUrl);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static("public"));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
         secret: process.env.SECRET,   
    },
   touchAfter: 24 * 3600,
   });

 store.on("error", () => { 
 console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret:  process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
       expires: Date.now() + 10 * 24 * 60 * 1000,
       maxAge:  10 * 24 * 60 * 1000,
       httpOnly: true,
    },
   };





app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());  // info store karte hai session me
passport.deserializeUser(User.deserializeUser());  // info remove karte hai session se

app.use((req,resp,next)=>{
    resp.locals.success = req.flash("success");
    // console.log(resp.locals.success);  //NOTE :- resp.locals is a array in which .success, .info, .error, msg is stored.
    resp.locals.error = req.flash("error");
    resp.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async(req,resp)=>{
//     let fakeUser = new User({
//         email: "Ankit88@gmail.com",
//         username:"Ankitkp",
//     });

//     let registeredUser = await User.register(fakeUser, "ankit1947");
//     resp.send(registeredUser);
// });

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


app.all(("*"),(req,resp,next)=>{
   next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,resp,next)=>{
    let{statusCode=500,message="Somthing went wrong!"}=err;
    resp.status(statusCode).render("error.ejs",{message} );
});

app.listen("3000", function(){
    console.log("Server is runing on port 3000...");
});

