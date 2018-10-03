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

// PRINT ARTICLES to t