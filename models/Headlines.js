//Model for our headline schema

//We require mongoose npm package
var mongoose = require("mongoose");

//Create a schema using the mongoose schema method
var Schema = mongoose.Schema;

var headlineSchema = new Schema({
    headline:{
        type: String,
        required: true,
        unique:true
    },
    summary:{
        type: String,
        required: true
    },
    date: String,
    saved:{
        type: Boolean,
        //default can be changed to true if the user chooses to save the article 
        default: false
    }
});

var Headline = mongoose.model("Headline", headlineSchema);

module.exports = Headline;
