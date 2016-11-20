/* 
file ONLY contains index page functionality
requirements have been moved seperate file for clarity
*/

//declaring global variables used
var count = 1;
var EE="";
var toggle = 0

//declaring global objects used
var tableObj = {
  major: [],
  core: [],
  reqSat: [],
  enrich: []
}


$(document).ready(function() {
  //loads CSV via local storage
  var data = localStorage.getItem('oldData');
  toggle = 0;
  console.log(toggle);
  //if info found, calls load data function
  if (data) {
    loadData(data);
  }
  //logs if no data returned
  else{
    console.log("no data returned");
  }
});

//Create CSV
function generateCSV() {

  //create CSV file
  var csvFile = "data:text/csv;charset=utf-8,";

  //Put major, core, and enrichment lists into tempMajor
  var tempMajor = tableObj.major.join();
  var tempCore = tableObj.core.join();

  //if major object contains elements then it adds final comma
  if(tableObj.major.length > 0){
  	tempMajor = tempMajor.concat(",");
  }

  //merges core classes with major classes
  tempMajor = tempMajor.concat(tempCore);
  
  //if course object contains elements then it adds final comma
  if(tableObj.core.length > 0){
  	tempMajor = tempMajor.concat(",");
  }

  //adds educational enrichment classes to string of classes
  tempMajor = tempMajor.concat(EE);

  csvFile += tempMajor;

  //Export CSV file
  var a = document.createElement('a');
    a.href     = csvFile;
    a.target   = '_blank';
    a.download = 'degreeData.csv';
    document.body.appendChild(a);
    a.click();

}

//generate report via bolded boxes
function generateReport(){
  var output = "";
  var cnt = 0;
  //checks tb1 checking each table row
  $("#tb1 tr").each(function(){
    //checks each table data element of current row
    $(this).find('td').each(function(){
      //saves current spot into temp
      temp = ($(this));

      //ignores educational enrichment boxes, continues to next table element 
      if(temp.hasClass("EduEnrich")){
        return true;
      }

      //makes sure table data element has text, ignores empty table data elements
      if(temp.text().trim().length){
        //add/remove class which makes thicker border to table element
        $(this).toggleClass("thickerBorder");
      }

      //removes thicker border class from elements with course in text
      if (temp.text().includes("(")){
        $(this).removeClass("thickerBorder");
      }

    })
  });
}

//Loads data to page passed from CSV 
//data is a string containing all loaded classes
function loadData(data) {
  var userInput = "";
  //starts at one because initial spot is stray character
  //loops through each character of the data string
  for(var i = 1; i < data.length; i++)
  {
      //comma signifies break between courses
      //bracket also signifies end of class as no comma is placed after final class from CSV
      if(data[i] == "," || data[i] == "]"){
        //setup string to acceptable program format
        //makes string lower case
        userInput = userInput.toLowerCase();
        //drops all white spaces from string
        userInput = userInput.replace(/\s+/g, '');
        //removes all quotes that exist in string
        userInput = userInput.replace(/"/g, '');

        //creates regex patter
        var regexPattern = /^[a-z]{1,4}[0-9,a,b]{1,3}$/;
        //tests inputs from CSV
        if (!regexPattern.test(userInput)){
          continue;
        }

        //checks if class should be added to major classes
        if(majorReq[userInput]){
          addMajorCourse(userInput)
        }
        //checks if class should be added to core classes
        else if(coreReq[userInput]) {
          addCoreCourse(userInput)
        }
        //classes added to educatoinal enrichment if unable to be added to previous lists
        else {
          addEnrich(userInput)
        }
        //resets userInput to blank
        userInput = "";
        continue;
      }
      //concatonates string 
      else{
        userInput+=data[i];
      }
  }
}

//grabs text from input box
function textGrab() {
  //grabs user input by element ID, converts to lower case
  var userInput = document.getElementById('userCourse').value.toLowerCase()
  //drops all white spaces in user input
  userInput = userInput.replace(/\s+/g, '');

  //creates regex patter
  var regexPattern = /^[a-z]{1,4}[0-9,a,b]{1,3}$/;
  //tests input to make sure it fits program formatting
  if (!regexPattern.test(userInput)){
    alert("wrong format")
    return;
  }

  //adds class to major list
  if(majorReq[userInput]){
    addMajorCourse(userInput)
  }
  //adds class to core list
  else if(coreReq[userInput]) {
    addCoreCourse(userInput)
  }
  //if not added to either list added to enrichment list
  else {
    addEnrich(userInput)
  }

  //clears box after function done running
  document.getElementById('userCourse').value = '';
}

//adds major classes to object and html
function addMajorCourse (userInput) {
  //reqMet is requirement(s) satisfied by course
  var reqMet = majorReq[userInput];
  //returns true if fails check so it enters if, false if it passes
  if (majorReqCheck(userInput, reqMet)) {
    return;
  }

  //checks if requirement met was a coen elective
  if (reqMet == 'coen elective'){
    //creates coen elective variable accounting for one of possible three
    var checkReqMet = reqMet + " " + count
    //checks current requirements met to adjust current coen elective count
    for(var i = 0; i<tableObj.reqSat.length;i++){
    	checkReqMet = reqMet + " " + count;
      //if coen elective found, count up
    	if(tableObj.reqSat[i] == checkReqMet){
    		count++;
    	}
    }


    // if(EE.includes(userInput)){
    //   console.log("found coen reuse");
    //   resetEEBox(userInput);
    // }

    //when coen elect greater than 3 it is added to enrichment
    if (count > 3){
      alert("coen electives already met, will be added to enrichment");
      addEnrich(userInput);
      return;
    }

    //inputting user course and req satisfied into html
    reqMet = reqMet + " " + count;
    var tdElement = reqMet + " (" + userInput + ")";
    //removes thick border if it still exsits
    $( "td:contains('" + reqMet + "')" ).removeClass();
    //adds X button functionality to corresponding table data element
    var button = '<button type="reset" value="reset" onclick="resetElectBox(\''+tdElement+'\')">X</button>'
    //changes background color to green and injuects html
    $( "td:contains('" + reqMet + "')" ).css("background-color", "#adebad");
    $( "td:contains('" + reqMet + "')" ).append(" ("+userInput+") "+button);
    //increments count to account for added coen elective
    count++;
  }
  else {
    //inputting user course and req satisfied into html
    var tdElement = reqMet + " (" + userInput + ")"
    //removes thick border if it still exsits
    //filter function finds exact match of requirement met corresponding to course input
    $("td").filter(function() {return $(this).text() === reqMet;}).removeClass();
    //adds X button functionality to corresponding table data element
    var button = '<button type="reset" value="reset" onclick="resetBox(\''+tdElement+'\')">X</button>'
    //finds user input in html table data, changes color to green
    $("td").filter(function() {return $(this).text() === reqMet;}).css("background-color", "#adebad");
    //finds user input in html table data, appends the users class to the row
    $("td").filter(function() {return $(this).text() === reqMet;}).append(" ("+userInput+") "+button);
    
  }
  // pushes requirement and course into major array and requirement array
  tableObj.reqSat.push(reqMet);
  tableObj.major.push(userInput);

  //console.log(tableObj.major + " *post add coen classes");
 // console.log(tableObj.reqSat + " *req satisfied obj");
}

//adds major classes to object and html
function addCoreCourse (userInput) {
  //reqMet is requirement(s) satisfied by course
  var reqMet = coreReq[userInput];
  //gets length of requirements the course fufills 
  var numReqMet = coreReq[userInput].length;

  //makes sure the reqMet is an object which means its a double dipper
  if(numReqMet > 1 && typeof(reqMet)=='object') {
    //for loop checks each requirement
    for(var k=0;k<numReqMet;k++){
      //enters check if course fails check
      if (coreReqCheck(userInput, reqMet[k])) {
        //for loop checks current classes being used against potential double dipper class
        for(var i = 0; i<tableObj.core.length;i++){
          //course variable from list of core classes already in use
          var course = tableObj.core[i];
          //check sees if double dipper can replace a single dipper class
          //checks if added course's requirement has already been satisfied and that if the requirement's course is not a double dipper
          if(reqMet[k] == coreReq[course] && typeof(coreReq[course])!='object'){
            var remTdElem = reqMet[k] + " (" + course + ")";
            //single dipper removed and added to enrichments
            resetCoreBox(remTdElem);
            addEnrich(course);
            //insert double dipper course one requirement at a time
            coreHTMLInject(userInput, reqMet[k]);
          }
             
        }

        continue;
      }
      //adds course and requirement to HTML
      coreHTMLInject(userInput, reqMet[k]);
    }
  }
  //single dipper classes
  else {
    //checks course, comes back true if it fails
    if (coreReqCheck(userInput, reqMet)) {
      //added to enrichment if it fails
      addEnrich(userInput)
      return;
    }

    //inputs core single dipper class into HTML
    coreHTMLInject(userInput, reqMet);

  }

  //pushes class entered into core array
  tableObj.core.push(userInput);
  //console.log(tableObj.core + " *post add core classes");
  //console.log(tableObj.reqSat + " *req satisfied obj");
}

//inserts the core class into the HTML
function coreHTMLInject(userInput, reqMet) {
  //creates variables to input the HTML
  var tdElement = reqMet + " (" + userInput + ")"
  $("td").filter(function() {return $(this).text() === reqMet;}).removeClass();
  var button = '<button type="reset" value="reset" onclick="resetCoreBox(\''+tdElement+'\')">X</button>'
  //finds user input in html table data, changes color to green
  $("td").filter(function() {return $(this).text() === reqMet;}).css("background-color", "#adebad");
  //finds user input in html table data, appends the users class to the row
  $("td").filter(function() {return $(this).text() === reqMet;}).append(" ("+userInput+") "+button);
  
  //add classes as they are input to object
  tableObj.reqSat.push(reqMet);
}

//adds educational enrichment to list and injects into HTML
function addEnrich(userInput){
  // commented out so that multiple classes can be added to enrichment list and HTML
  // if(EE.includes(userInput)){
  //   alert("Educational enrichment already added");
  //   return;
  // }

  //add enrichment to string and array
  EE = EE.concat(userInput+", ");
  tableObj.enrich.push(userInput);
  var button = '<button type="reset" value="reset" onclick="resetEEBox(\''+userInput+'\')">X</button>';
  $( "td:empty" ).first().append(userInput + "  " + button);
}

//reset educational enrichment box blank
function resetEEBox(userInput){
  //finds latest addition of class adn removes it from HTML and array
  $( "td:contains('" + userInput + "')" ).last().text('');
  EE = EE.replace(userInput+",", "")
  var index = tableObj.enrich.indexOf(userInput);
  tableObj.enrich.splice(index, 1);
  console.log(tableObj.enrich)
}

//reset MAJOR class box
function resetBox(tdElement){
  //gets original tdElement requirement text
  var originalValue = tdElement.split("(");
  //grabs the course portion of the HTML text 
  var course = originalValue[1].substring(0, originalValue[1].length-1);
  //originalValue refers to the requirement displayed on the webpage 
  originalValue = originalValue[0].substring(0, originalValue[0].length-1);

  //HTML manipulation
  //$("td").filter(function() {return $(this).text() === originalValue;}).addClass("thickerBorder");
  //adds thicker border class incase generate report button is toggled
  $( "td:contains('" + tdElement + "')" ).addClass("thickerBorder");
  //flips the color of the element back to red
  $( "td:contains('" + tdElement + "')" ).css("background-color", "#ff9980");
  //sets the table data back to just displaying the requirement
  $( "td:contains('" + tdElement + "')" ).text(originalValue);
  //removes course and requirement from their respective array
  var index = tableObj.major.indexOf(course);
  tableObj.major.splice(index, 1);
  index = tableObj.reqSat.indexOf(originalValue);
  tableObj.reqSat.splice(index, 1);


  // console.log(tableObj.major + " *post delete major classes");
  // console.log(tableObj.reqSat + " *req satisfied obj");
  
  //function goes through each td element and checks if thicker border class has been added 
  $("#tb1 tr").each(function(){
      $(this).find('td').each(function(){
        temp = ($(this));
        //the if statement checks if the thicker border class has been added and ignores empty table elements
        if(!temp.hasClass("thickerBorder") && temp.text().trim().length > 0){
          //removes class thicker border if the other elements do not have it
          $("td").filter(function() {return $(this).text() === originalValue;}).removeClass();
        }
    })
  });

  //call function at end to see if enrichment should be moved
  enrichReAdd();

}

//reset technical electives class box
function resetElectBox(tdElement) {
  //gets original tdElement requirement text
  var originalValue = tdElement.split("(");
  //grabs the course portion of the HTML text 
  var majorCourse = originalValue[1].substring(0, originalValue[1].length-1);
  
  //saves requirement
  originalValue = originalValue[0].substring(0, originalValue[0].length-1);

  //HTML manipulation
  //adds thicker border class incase generate report button is toggled
  $( "td:contains('" + tdElement + "')" ).addClass("thickerBorder");
  //flips the color of the element back to red
  $( "td:contains('" + tdElement + "')" ).css("background-color", "#ff9980");
  //sets the table data back to just displaying the requirement
  $( "td:contains('" + tdElement + "')" ).text(originalValue);

  //deletes user input class from list of major classes
  var index = tableObj.major.indexOf(majorCourse);
  tableObj.major.splice(index, 1);
  var lastChar = originalValue.slice(-1);
  if (lastChar < count){
    count = lastChar;
  }

  index = tableObj.reqSat.indexOf(originalValue);
  tableObj.reqSat.splice(index, 1);

  //console.log(tableObj.major + " *post delete major classes");
  //console.log(tableObj.reqSat + " *req satisfied obj");

  //
  $("#tb1 tr").each(function(){
      $(this).find('td').each(function(){
        temp = ($(this));
        if(!temp.hasClass("thickerBorder") && temp.text().trim().length > 0){
          console.log("found temp");
          flag = 1;
          $("td").filter(function() {return $(this).text() === originalValue;}).removeClass();
        }
    })
  });
  //call function at end to see if enrichment should be moved
  enrichReAdd();
}


function resetCoreBox(tdElement){
  //console.log(tdElement);
  //removes all occurances of poli2 but replaces with poli2

  //gets original tdElement requirement text
  var delReq = "";
  var originalValue = tdElement.split("(");
  var originalReq = originalValue[0].substring(0, originalValue[0].length-1);
  var course = originalValue[1].substring(0, originalValue[1].length-1);
  var reqMet = coreReq[course];
  //nsole.log(reqMet);
  var numReqMet = coreReq[course].length;
  var flag = 0;
  //console.log(typeof(reqMet));
  if(numReqMet > 1 && typeof(reqMet)=='object') {
    for(var k=0;k<numReqMet;k++){
      //console.log(reqMet);
      //console.log(originalValue);
      var htmlText = $( "td:contains('" + course + "')" ).first().text();
      //console.log(htmlText);
      if (htmlText == "") {
        //console.log("we out here");
        break;
      }
      //console.log(htmlText + " html text");
      var textSplit = htmlText.split("(");
      //console.log(textSplit)
      reqSplit = textSplit[0].substring(0, textSplit[0].length-1);
      //console.log(reqSplit);
      $( "td:contains('" + reqSplit + "')" ).addClass("thickerBorder");

      $( "td:contains('" + htmlText + "')" ).first().css("background-color", "#ff9980");
      //$( "td:contains('" + tdElement + "')" ).text('');
      //console.log(course);
      $( "td:contains('" + htmlText + "')" ).first().text(reqSplit);
      //removes item from array
      console.log(tableObj.core + " *pre delete core classes");
      //console.log(tableObj.reqSat + " *req satisfied obj");
      var index = tableObj.core.indexOf(course);
      console.log(index + "*index");
      if (index > -1){
        tableObj.core.splice(index, 1);
      }




      $("#tb1 tr").each(function(){
        $(this).find('td').each(function(){
          temp = ($(this));
          /*does NOT Work properly still*/
          if(!temp.hasClass("thickerBorder") && temp.text().trim().length > 1){
            console.log("found temp!!!!"+k);
            console.log(temp.text())
            console.log(reqSplit +" reqSplit")
            flag = 1;
            $("td").filter(function() {return $(this).text() === reqSplit;}).removeClass();
          }
        })
      });




      console.log(tableObj.core + " *post  delete core classes");
      //delReq = delReq + " " + reqSplit;
      delReq = reqSplit
      console.log(delReq +" saved req");
      console.log(tableObj.reqSat + " *pre delete reqsaved");
      //console.log(reqMet[k] + " *reqmet");


      index = tableObj.reqSat.indexOf(reqSplit);
      console.log(index +" *index of reqsaved");
      tableObj.reqSat.splice(index, 1);
      console.log(tableObj.reqSat + " *post delete reqsaved");

      // if(flag == 1){
      //   $("td").filter(function() {return $(this).text() === reqSplit;}).removeClass();
      // }
    }
  }
  else {
  //  console.log(reqMet);
    //console.log(originalValue);
    var htmlText = $( "td:contains('" + course + "')" ).first().text();
    //console.log(htmlText + " html text");
    var textSplit = htmlText.split("(");
    reqSplit = textSplit[0].substring(0, textSplit[0].length-1);
    $( "td:contains('" + course + "')" ).addClass("thickerBorder");
    $( "td:contains('" + course + "')" ).first().css("background-color", "#ff9980");
    //$( "td:contains('" + tdElement + "')" ).text('');
    //console.log(originalReq);
    $( "td:contains('" + course + "')" ).first().text(reqSplit);
    

    $("#tb1 tr").each(function(){
        $(this).find('td').each(function(){
          temp = ($(this));
          if(!temp.hasClass("thickerBorder") && temp.text().trim().length > 0){
            console.log("found temp");
            flag = 1;
            $("td").filter(function() {return $(this).text() === reqSplit;}).removeClass();
          }
      })
    });

    //removes item from array
    var index = tableObj.core.indexOf(course);
    tableObj.core.splice(index, 1);
    index = tableObj.reqSat.indexOf(reqMet);
    tableObj.reqSat.splice(index, 1);
    delReq = reqSplit;
    //console.log(delReq +" saved req");
    //console.log(tableObj.reqSat + " req obj");

  }

  console.log(tableObj.core + " *post post delete core classes");
  console.log(tableObj.reqSat + " *req satisfied obj");
  //check the saved deleted requirement
  //console.log(delReq);

  //
  for(var i = 0; i<tableObj.core.length;i++){
    course = tableObj.core[i];
    if(coreReq[course].indexOf(delReq) > -1){
      index = coreReq[course].indexOf(delReq);
      reAdd(course, coreReq[course][index])
    }
  }

  //call function at end to see if enrichment should be moved
  enrichReAdd();
}

//function checks if requirement removed can be satisfied by a double dipper that is currently in list 
//will change element removed to satisfied
function reAdd(course, reqMet){
  //sets up variable to match html text
  var tdElement = reqMet + " (" + course + ")";
  var button = '<button type="reset" value="reset" onclick="resetCoreBox(\''+tdElement+'\')">X</button>';
  $("td").filter(function() {return $(this).text() === reqMet;}).removeClass();
  //finds user input in html table data, changes color to green
  $( "td:contains('" + reqMet + "')" ).css("background-color", "#adebad");
  //finds user input in html table data, appends the users class to the row
  $( "td:contains('" + reqMet + "')" ).append(" ("+course+") "+button);
  //add classes as they are input to object
  tableObj.reqSat.push(reqMet);
  console.log(tableObj.reqSat + " readded reqs");
}

//readds classes from educational enrichments to either major or core classes
function enrichReAdd (){
  //gets the size of the enrichment classes array
  var size = tableObj.enrich.length;
  for(var i=0;i<size;i++){
    //temporaryily saves the enrichment course 
    var course = tableObj.enrich[i];
    
    //checks to see if the current list of enrichment classes can be moved to the major or core list
    //if class fits into another list, then it is removed from enrichment list and added to appropiate group
    //checks if class fits in to major list
    if(majorReq[course]){
        resetEEBox(course);
        addMajorCourse(course);
    }
    //checks if class fits in to core list
    else if(coreReq[course]) {
      resetEEBox(course);
      addCoreCourse(course);
    }
    else{
      continue;
    }
  }
}

//checks that user input is: not undefined, not already addded to list of classes, requirement not already satisfied
//returns true becuase it failed the check
function majorReqCheck (userInput, reqMet) {
  //if reqMet comes back undefined then requirement not available in list
  if(typeof(reqMet) === 'undefined'){
    //alert("not in major reqs!");
    return true;
  }

  //checks if course already exsists in course list
  if(tableObj.major.includes(userInput)){
    //alert("class: "+ userInput+" already added");
    return true;
  }

  //checks if requirement met is already in list
  if(tableObj.reqSat.includes(reqMet)){
    //alert("requirment: "+reqMet+" already satisfied");
    return true;
  }

  return false;
}

//checks that user input is: not undefined, not already addded to list of classes, requirement not already satisfied
//returns true becuase it failed the check
function coreReqCheck(userInput, reqMet){
  //if reqMet is undefined then requirement not available in list
  if(typeof(reqMet) === 'undefined'){
    //alert("not in core reqs!");
    return true;
  }

  //checks if course already exsists in course list
  if(tableObj.core.includes(userInput)){
    //alert("class: "+ userInput+" already added");
    return true;
  }

  //checks if requirement met is already in list
  if(tableObj.reqSat.includes(reqMet)){
    //alert("requirment: "+reqMet+" already satisfied");
    return true;
  }

  return false;
}

//enter button functionality
$(document).keypress(function(ev){
  if (ev.which == 13) {
    textGrab();
  }
});


//autocomplete js funciton
$(function() {
  $( "#userCourse" ).autocomplete({source: availableClasses});
});

/*

//two dimensional array to keep track of satisfied classes
//figure out how to remove coen electives
//when deleting elective save count number to reset counter to deleted row, check to see if coutner is less than current coutner value
*/
