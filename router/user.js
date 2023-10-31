const express = require("express");
const router = express.Router();
const passport = require("passport");
const controllerUsers = require("../controllers/users.js");
const wrapAysnc = require("../utils/wrapAysnc.js");

router
.route("/signup")
.get( wrapAysnc(controllerUsers.signupForm))
.post( controllerUsers.postSignup);

router
.route("/login")
.get(controllerUsers.loginForm)
.post( passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), controllerUsers.authenticateLogin);

router.get("/logout", controllerUsers.logout);
module.exports = router;
