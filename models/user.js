const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
    },
    // We does not add Username and Password in our Schema 
    // because it is automaticly added by passport-local-mongoose npm package.    
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);








