//Model for our note schema

//Requires a mongoose npm package
var mongoose = require("mongoose");

//Create a schema using the mongoose schema method
var Schema = mongoose.Schema;

var noteSchema = new Schema({
    //The associated article that we want to attach the note to
    _headlineId:{
        type: Schema.Types.ObjectId,
        ref: "Headline"
    },
    date: String,
    //The user's note text that they attach
    noteText: String
});

var Note = mongoose.model("Note", noteSchema);

module.exports = Note;