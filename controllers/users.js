const User = require("../models/user.js");

module.exports.signupForm = (req,resp)=>{
    resp.render("users/signup.ejs");
};

module.exports.postSignup  = async (req,resp)=>{
  try{
    let {username,email,password} = req.body;
    let newUser = new User({ email,username});
    let registeredUser = await User.register(newUser, password);
     console.log(registeredUser);
     req.login(registeredUser,(err)=>{
     if(err){
       return next(err);
     }
     req.flash("success", "Welcome to WanderLust");
     resp.redirect("/listings");
     });
    } catch (e){
        req.flash("error", e.message);
        resp.redirect("/signup");
    }
};

module.exports.loginForm = (req,resp)=>{
    resp.render("users/login.ejs");
};

module.exports.authenticateLogin  = async(req,resp)=>{
    req.flash("success","Welocome to wonderlust you are logged in!");
    resp.redirect("/listings");
};

module.exports.logout = (req,resp,next)=>{
    req.logout((err)=>{
    if(err){
    return next(err);
     }
  
    req.flash("success", "you are loged out!");
    resp.redirect("/listings"); 
   });
};