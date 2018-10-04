// client-side javascript for homepage functions

$(document).ready(function(){


// ====================== GLOBAL VARIABLES ============================ //
var articleContainer= $(".article-container");
// references the div where all the articles should be displayed
// ====================== END GLOBAL VARIABLES ======================== //


// ====================== MAIN PROGRAM FLOW  ========================== //
/* add event listeners to dynamically generated
buttons- both "save article" and "scrape new article"*/
$(document).on("click", ".btn.save", handleArticleSave);
$(document).on("click", ".scrape-new", handleArticleScrape);

//call init page function first thing once page is ready
initPage();
// ====================== END MAIN PROGRAM FLOW  ======================== //


// ====================== FUNCTIONS ===================================== //

// Initialize Page/Reset Page
function initPage() {
    // Empty the article-container div
    articleContainer.empty();
    
    //AJAX request for unsaved headlines
    $.get("/api/headlines?saved=false")
        .then(function(data) {
            if (data && data.length) {
                // if we have headlines, render them to the page
                renderArticles(data);
            } 
            else {
                // else render "no articles" message 
                renderEmpty();
            } 
        });
};
// END Initialize Page/Reset Page


// RENDER ARTICLES to the article-container div
function renderArticles(articles) {
    //function takes in a JSON array containing all articles in database
    // pass each item in array to the "createPanel" function
    var articlePanels = [];

    for (var i = 0; i < articles.length; i++) {
        articlePanels.push(createPanel(articles[i]));        
    }
    // after all the listings have been created and added to the array
    // append to the articlePanels container
    articleContainer.append(articlePanels);
};
// END RENDER ARTICLES


// CREATE SINGLE ARTICLE LISTING
// this creates a single listing for an article from the scraped data
function createPanel(article){
    var panel = 
    $(["<div class='panel panel-default'>",
    "<div class= 'panel-heading'>",
    "<h3>",
    article.headline,
    "<a class= 'btn btn-success save'>",
    "Save Article",
    "</a>",
    "</h3>",
    "<div class= 'panel-body'>",
    article.summary,
    "</div>",
    "</div>"
    ].join(""));

    //Attach the articles's id to the JQUERY element
    panel.data("_id", article._id);

    //Return the constructed panel JQUERY element
    return panel;
}

// END CREATE SINGLE ARTICLE LISTING


// PRINT "NO ARTICLES" MESSAGE
function renderEmpty() {
    // renders message explaining that we don't have any articles
    // also asks user what they'd like to do and renders links for those choices
    var emptyAlert = 
    $(["<div class='alert alert-warning text-center'>",
    "<h4>No new articles are available.</h4>",
    "</div>",
    "<div class='panel panel-default'>",
    "<div class='panel-heading text-center'>",
    "<h3>What Would You Like To Do?</h3>",
    "</div>",
    "<div class='panel-body text-center'>",
    "<h4><a class='scrape-new'>Scrape New Articles</a></h4>",
    "<h4><a href='/saved'>Go To Saved Articles</a></h4>",
    "</div>",
    "</div>"
    ].join(""));

    //append emptyAlert to the articleContainer div
    articleContainer.append(emptyAlert);    
};
// END PRINT "NO ARTICLES" MESSAGE


// SAVE ARTICLE FUNCTION
function handleArticleSave() {
    //triggered when user hits button to save an article
    //starts by retrieving the article id that was attached to the element when it was setup
    var articleToSave = $(this).parents(".panel").data();
    articleToSave.saved = true;

     //AJAX update call
    // patch method should be correct for updating an existing database entry
    $.ajax({
        method: "PATCH",
        url: "/api/headlines",
        data: articleToSave
    })
    .then(function(data){
        //if successful mongoose will send back "ok: true" so can use this to check for success
        if (data.ok) {
            //run init page function again to reload the page
            initPage();
        }
    });
};
// END SAVE ARTICLE FUNCTION

// SCRAPE ARTICLE FUNCTION
function handleArticleScrape() {
    //triggers when user clicks a button to scrape new articles
    $.get("/api/fetch")
        .then(function(data) {
            initPage();
            bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
        });
}
// END SCRAPE ARTICLE FUNCTION

// ====================== END FUNCTIONS  ================================================================= //

});