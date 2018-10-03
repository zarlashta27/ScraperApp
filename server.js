//Require our dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

//Set our port
var PORT = process.env.PORT || 3000;

//Instantiate our express app
var app = express();

//Set up an express router
var router = express.Router();

//Require our routes file to pass our router object
require("./config/routes")(router);

//Designate our public folder as a static directory
app.use(express.static(__dirname + "/public"));

//Connect handlebars to our Express app
//Displays the html and css of the home.handlebars page and the saved.handlebars page
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//Use bodyParser in our app
app.use(bodyParser.urlencoded({
    extended: false
}));

//Have every request go through our router middleware
app.use(router);

//If deployed, use the deployed database, otherwise use the local mongoHeadlines database on our machine
var db = process.env.MONGODB_URL || "mongodb://localhost/mongoHeadlines";

//Connect mongoose to our database
mongoose.connect(db, function(error){
    //log any errors connecting with mongoose
    if(error){
        console.log(error);
    }
    //If no errors, let us know it was connected successfully
    else{
        console.log("mongoose connection is successful");
    }
});

//Listen on the port
app.listen(PORT, function(){
    console.log("Listening on port:" + PORT);
    
});

