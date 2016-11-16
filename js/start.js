//jQuery
$(document).ready(function () {
  $("#createbtn").click(function () {
    localStorage.clear();
    window.location.href ="index.html";
  });

  initLoad();
});

function loadPage(){
  location.href = "input.html";
};

function grabFile(){
  var fr = new FileReader();
  //console.log(fr);
  var files = $("#filebtn").prop('files');
  //console.log(files);
  fr.readAsText(files[0]);
  fr.onload = function() {
    var importData = this.result;
    importData = importData.split(",");
    importData.pop();
    //console.log(importData);
    openInputHtml(importData);
  }
}

function openInputHtml(importData){
  localStorage.setItem("oldData", JSON.stringify(importData));
  //localStorage.setItem("oldData", importData);
  window.location.href = "index.html";


}

function initLoad(){
  $("#loadbtn").click(function() {
    grabFile();
  });
}
