//Bring in our scrape scripts and makeDate scripts
var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

//Bring in the Headline and Note mongoose models
var Headline = require("../models/Headlines");

//module.export object that holds all the functionalty for deleting and saving the different articles
module.exports = {
    //fetch will run the scrape function, grab all the articles and insert them into the headline collection in the mongo database
    fetch: function(cb){
        //run the scrape function
        scrape(function(data){
            //Set the data to be called articles
            var articles = data;
            //run through each article to insert the date and set saved to false on all of them
            for(var i=0; i<articles.length; i++){
                articles[i].date = makeDate();
                articles[i].saved = false;
            }
            //This is a mongo function which takes the Headline and inserts into that collection lots of different articles.
            //Insert function
            Headline.collection.insertMany(articles, {ordered: false}, function(err, docs){
                cb(err, docs);
            });
        });

    },
    //Delete function will run and whatever headline that was queried will be removed
    delete: function(query, cb){
        Headline.remove(query, cb);
    },
    //Get function that gets all the articles from the collection
    get: function(query, cb){
        //Find all the headlines in the query
        Headline.find(query)
        //Sort the articles from most recent to least recent
        .sort({
            _id: -1
        })
        //Then pass all those articles to our call back function
        .exec(function(err, doc){
            cb(doc);
        });
    },
    //Update function which updates any new articles that are scraped with the relevant id
    update: function(query, cb){
        Headline.update({_id: query._id},{
            $set:query
        }, {}, cb);
    }
    
}
