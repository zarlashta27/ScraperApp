//Here we need to write the scripts needed to create our date and to scrape the articles from new york times using cheerio

//scrape script
//=============

//Require request and cheerio, making our scrapes possible
var request = require("request");
var cheerio = require("cheerio");

//Created a big variable called scrape which is exported at the bottom of the page
var scrape = function(cb){
    //Used request package to extract information from the new york times website
    request("http://www.nytimes.com", function(err, res, body){
        var $ = cheerio.load(body);

        var articles = [];

        //Select all the theme-summary and on each of these theme-summary, need to grab the text and cut off any white spaces for both the story-heading and summary which are both children of the theme-summary.
        $(".theme-summary").each(function(i, element){
            var head = $(this).children(".story-heading").text().trim();
            var sum = $(this).children(".summary").text().trim();

            //If the scraper was able to get the text from both the head and sum children objects, then do this replace regex method which cleans up our text with white space
            if(head && sum){
                var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                
                var dataToAdd = {
                    headline: headNeat,
                    summary: sumNeat
                };
                articles.push(dataToAdd);
            }
        });
        //the call back sends us articles
        cb(articles);
    });

};

//export scrape so we can use it throughout our program
module.exports = scrape;