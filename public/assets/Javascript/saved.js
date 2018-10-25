// client-side javascript for functions on page showing saved articles
// handles what information to display and calling of routes
// also handles the creation and deletion of comments

$(document).ready(function(){


// ====================== GLOBAL VARIABLES =========================
var articleContainer= $(".article-container");
// references the div where all the articles should be displayed
// ====================== END GLOBAL VARIABLES =====================


// ====================== MAIN PROGRAM FLOW  ======================== //

/*Add event listeners to dynamically generated
buttons- "delete articles", "pulling up article notes", "saving article notes",
"deleting article notes" */
$(document).on("click", ".btn.delete", handleArticleDelete);
$(document).on("click", ".btn.notes", handleArticleNotes);
$(document).on("click", ".btn.save", handleNoteSave);
$(document).on("click", ".btn.note-delete", handleNoteDelete);

//call initialize page function first thing once page is ready
initPage();
// ====================== END MAIN PROGRAM FLOW  ======================== //


// ====================== FUNCTIONS ===================================== //

// Initialize Page/Reset Page
function initPage() {
    // Empty the article-container div
    articleContainer.empty();
    
    //AJAX request for saved headlines
    $.get("/api/headlines?saved=true")
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
    "<a class= 'btn btn-danger delete'>",
    "Delete From Saved",
    "</a>",
    "<a class= 'btn btn-info notes'>Article Notes</a>",
    "</h3>",
    "</div>",
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
    // renders message explaining that we don't have any articles to view
    var emptyAlert = 
    $(["<div class='alert alert-warning text-center'>",
    "<h4>No saved articles are available.</h4>",
    "</div>",
    "<div class='panel panel-default'>",
    "<div class='panel-heading text-center'>",
    "<h3>Would You Like to Browse Available Articles?</h3>",
    "</div>",
    "<div class='panel-body text-center'>",
    "<h4><a href='/'>Browse Articles</a></h4>",
    "</div>",
    "</div>"
    ].join(""));

    //append emptyAlert to the articleContainer div
    articleContainer.append(emptyAlert);    
};
// END PRINT "NO ARTICLES" MESSAGE


// DELETE ARTICLE FUNCTION
//This function handles deleting articles/headlines
function handleArticleDelete() {
    var articleToDelete = $(this).parents(".panel").data();

    //AJAX DELETE call
    $.ajax({
        method: "DELETE",
        url: "/api/headlines/" + articleToDelete._id
    })
    .then(function(data){
        //if successful mongoose will send back "ok: true" so can use this to check for success
        if (data.ok) {
            //run initialize page function again to reload the page
            //the reloaded page will then show the saved articles less the deleted one
            initiPage();
        }
    });
};
// END DELETE ARTICLE FUNCTION


// ARTICLE NOTE HANDLER
function handleArticleNotes() {
    //handles opening notes modal and displaying our notes
    var currentArticle = $(this).parents(".panel").data();
    
    //constructing the url route for the notes
    // then constructing the html for the modal using jQuery
    // uses an array and join for easier reading
    $.get("/api/notes/" + currentArticle._id)
        .then(function(data) {
            var modalText = [
                "<div class = 'container-fluid text-center'>",
                "<h4>Notes on Article: ",
                currentArticle._id,
                "</h4>",
                "<hr />",
                "<ul class='list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class='btn btn-success save'>Save Note</button>",
                "</div>"
            ].join("");
            //adds the above html to the note modal
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };
            //add info about the article and notes to the save button for eay access later
            $(".btn.save").data("article", noteData);

            //This will add the actual note html inside the opened modal
            renderNotesList(noteData);
        });
}
// END ARTICLE NOTE HANDLER 


// RENDER NOTES LIST FUNCTION
function renderNotesList(data) {
    //This function handles rendering note list items to our notes modal
    //Setting up an array of notes to render after finished
    //Also setting up a currentNote variable to temporarily store each note
    var noteToRender = [];
    var currentNote;

    if (!data.notes.length) {
        // if there are no notes on the article, have a message say that
        currentNote = $([
            "<li class='list-group-item'>",
            "This article doesn't have any notes.",
            "</li>"
        ].join(""));
        noteToRender.push(currentNote);
    }
    else {
        // else if there are notes to render, loop through them and print each one
        for (var i = 0; i < data.notes.length; i++) {
            currentNote = $([
            "<li class='list-group-item note'>",
            data.notes[i].noteText,
            "<button class='btn btn-danger note-delete'>x</button>",
            "</li>"
            ].join(""));

            currentNote.children("button").data("_id", data.note[i]._id);
            // finally, add our currentNote to the notesToRnder array
            noteToRender.push(currentNote);
        }
    }
    // append the noteToRnder to the note-container inside the note modal
    $(".note-container").append(noteToRender);
}
// END RENDER NOTES LIST FUNCTION










})