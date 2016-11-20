$(document).ready(function () {
  //clears local storage on button click, linked to input page
  $("#createbtn").click(function () {
    localStorage.clear();
    window.location.href ="index.html";
  });
  //readies the load button
  initLoad();
});

function loadPage(){
  location.href = "input.html";
};

//function to read CSV file and make information usable
function grabFile(){
  //establishes file reader object
  var fr = new FileReader();
  //grabs file properties with uploaded files
  var files = $("#filebtn").prop('files');

  //grabs the first file object from file reader
  fr.readAsText(files[0]);
  //loads the file information from file object and splits at comma
  fr.onload = function() {
    var importData = this.result;
    importData = importData.split(",");
    //pops off the last character of string, was irrelevant character
    importData.pop();
    //calls function to pass over string to next page
    openInputHtml(importData);
  }
}

//function that passes information to next page
function openInputHtml(importData){
  //saves information to localstorage, calls next page
  localStorage.setItem("oldData", JSON.stringify(importData));
  //localStorage.setItem("oldData", importData);
  window.location.href = "index.html";


}

function initLoad(){
  //onclick functionality that grabs information from imported files
  $("#loadbtn").click(function() {
    grabFile();
  });
}
