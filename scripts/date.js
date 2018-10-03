//date script
//Created a variable for the date and exported at the bottom
var makeDate = function(){
    var d = new Date();
    var formattedDate = "";

    //Add the month
    formattedDate += (d.getMonth() + 1) + "_";
    //Add the date
    formattedDate += d.getDate() + "_";
    //Add the year
    formattedDate += d.getFullYear();

    //Return the fully formatted date
    return formattedDate;
};

module.exports = makeDate;