

const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
   
    email_id: {
        type: String,
        required: [true, "User Email is required"],
        trim: true,
    },
   
    password: {
        type: String,
        required: [true, "password is required"],
    },
    

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema)


