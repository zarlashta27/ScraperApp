//Controller for our notes

var Note = require("../models/Notes");
var makeDate = require("../scripts/date");

//module.export object that holds all the functionalty such as get, delete and etc.
//It's important to note that there is no fetch function here because we are not scraping note data in. This is created by the user.
module.exports = {
    //Get function that will grab the notes associated with the article
    get: function(data, cb){
        Note.find({
           _headlineId: data._id 
        }, cb);
    },

    //Saved function taking in data from user and the call back function
    save: function(data, cb){
        //Create an object newNote with the date and note text typed by the user.
        var newNote= {
            _headlineId: data._id,
            date: makeDate(),
            noteText: date.noteText
        };
        //Creates a note - runs a function to return an error or the document
        Note.create(newNote, function(err, doc){
            if (err){
                console.log(err);
            }
            else{
                console.log(doc);
                cb(doc);
            }
        });
    },

    //Delete Function so that the user can remove the notes associated with the articles
    delete: function(data, cb){
        Note.remove({
            _id: data._id
        }, cb);
    }
};