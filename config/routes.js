//Server routes

//Bring in the scrape function from our scripts directory
var scrape = require("../scripts/scrape");

//Bring headlines & notes from the controller
var headlinesController = require("../controllers/headlines");
var notesController = require("../controllers/notes");

module.exports = function(router){
    //This route renders the home page
    router.get("/", function(req, res){
        res.render("home");
    });
    //This route renders the saved page
    router.get("/saved", function(req, res){
        res.render("saved");
    });
    //This is an API route for the fetch function created in the headlines.js file 
    router.get("/api/fetch", function(req, res){
        headlinesController.fetch(function(err, docs){
            if (!docs || docs.insertedCount === 0){
                res.json({
                    message: "No new articles today. Try again tomorrow!"
                });
            }
            else{
                res.json({
                    message: "Added" + docs.insertedCount + "new articles!"
                });

            }
        });
    });
    //Route for the get function in the headlines controller. its going to grab all the headlines in the database
    router.get("/api/headlines", function(req, res){
        var query = {};
        //If user specifies a saved article, it will set the query equal to that
        if (req.query.saved){
            query = req.query;
        }
        //If user does not specify anything, will return everything in res.json(data)
        headlinesController.get(query, function(data){
            res.json(data);
        });
    });
    //A route to delete a specific article
    router.delete("/api/headlines/:id", function(req, res){
        var query = {};
        query._id =req.params.id;

        headlinesController.delete(query, function(err, data){
            res.json(data);
        });
    });
    //A route to update articles if needed
    router.patch("/api/headlines", function(req, res){
        headlinesController.update(req.body, function(err, data){
            res.json(data);
        });
    });
    //A route that will grab all the notes associated with the article so that we can display it to the user
    router.get("/api/notes/:headline_id?", function(req, res){
        var query ={};
        if (req.params.headline_id){
            query._id = req.params.headline_id;
        }
        notesController.get(query, function(err, data){
            res.json(data);
        });
    });
    //A route to delete the notes
    router.delete("/api/notes/:id", function(req, res){
        var query = {};
        query._id =req.params.id;

        notesController.delete(query, function(err, data){
            res.json(data);
        });
    });
    //A route to post new notes to articles
    router.post("/api/notes", function(req, res){
        notesController.save(req.body, function(data){
            res.json(data);
        });
    });

}