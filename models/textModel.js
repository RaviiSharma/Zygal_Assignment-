

const mongoose = require("mongoose");


const textSchema = new mongoose.Schema({
   
    text: {
        type: String,
        required: [true],
        trim: true,
    },
   
   

}, { timestamps: true });

module.exports = mongoose.model('text', textSchema)


