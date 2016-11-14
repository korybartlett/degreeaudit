var count = 1;
var EE="";

var tableObj = {
  major: [],
  core: [],
  reqSat: [],
  enrich: []
}

$(document).ready(function() {
  var data = localStorage.getItem('oldData');
  if (data) {
    loadData(data);
  }
  else{
    console.log("no data returned");
  }
});

function generateCSV() {

  //create CSV file
  var csvFile = "data:text/csv;charset=utf-8,";

  //Put major, core, and enrichment lists into tempMajor
  var tempMajor = tableObj.major.join(",");
  //console.log(tempMajor);
  var tempCore = tableObj.core.join(",");
  //console.log(tempMajor);
  if(tableObj.major.length > 0){
  	tempMajor = tempMajor.concat(",");
  }
  tempMajor = tempMajor.concat(tempCore);
  if(tableObj.core.length > 0){
  	tempMajor = tempMajor.concat(",");
  }
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

function generateReport(){


  var output = "";
  var cnt = 0;
  $("#tb1 tr").each(function(){
    $(this).find('td').each(function(){
      temp = ($(this));
      //for (var x in majorReq){
      // if (!temp.includes("(")){
      //   output = output.concat(temp+"\t");
      //   //cnt+=1;
      // }
      // //for (var y in coreReq){
      // else if (!temp.includes("(")){
      //   output = output.concat(temp+"\t");
      //   //cnt+=1;
      // }
      if(temp.hasClass("EduEnrich")){
        return true;
      }

      if(temp.text().trim().length){
        //console.log("found unmet");
        //temp.text('test');
        $(this).toggleClass("thickerBorder");
      }
      
      if (temp.text().includes("(")){
        $(this).removeClass("thickerBorder");
      }

    })
  });
  output = output.concat("\n");
  output = output.concat("These courses can be used for Educational Enrichment electives: ");
  output = output.concat(EE);
  return output;
}

function loadData(data) {
  //console.log(data);
  var userInput = "";
  for(var i = 1; i < data.length; i++)
  {
      if(data[i] == "," || data[i] == "]"){
        userInput = userInput.toLowerCase();
        userInput = userInput.replace(/\s+/g, '');
        userInput = userInput.replace(/"/g, '');
        console.log(userInput);
        var regexPattern = /^[a-z]{1,4}[0-9,a,b]{1,3}$/;
        if (!regexPattern.test(userInput)){
          alert("wrong format")
          continue;
        }

        if(majorReq[userInput]){
          addMajorCourse(userInput)
        }
        else if(coreReq[userInput]) {
          addCoreCourse(userInput)
        }

        else {
          addEnrich(userInput)
        }
        userInput = "";
        continue;
      }
      else{
        userInput+=data[i];
        //console.log(userInput);
      }
  }
}

function textGrab() {
  //grabs user input by element ID, converts to lower case
  var userInput = document.getElementById('userCourse').value.toLowerCase()
  //drops all white spaces in user input
  userInput = userInput.replace(/\s+/g, '');
  //userInput = userInput.subString(0, 4) + ' ' + userInput.subString(4)
  //console.log(typeof(userInput));

  var regexPattern = /^[a-z]{1,4}[0-9,a,b]{1,3}$/;
  if (!regexPattern.test(userInput)){
    alert("wrong format")
    return;
  }

  if(majorReq[userInput]){
    addMajorCourse(userInput)
  }
  else if(coreReq[userInput]) {
    addCoreCourse(userInput)
  }

  else {
    addEnrich(userInput)
  }

  document.getElementById('userCourse').value = '';
}

function addMajorCourse (userInput) {
  var reqMet = majorReq[userInput];

  //returns true if fails check, false if it passes
  if (majorReqCheck(userInput, reqMet)) {
    return;
  }


  if (reqMet == 'coen elective'){
    checkReqMet = reqMet + " " + count
    //console.log(count);
    //console.log("String checked in array "+checkReqMet)
    for(var i = 0; i<tableObj.reqSat.length;i++){
    	checkReqMet = reqMet + " " + count;
    	if(tableObj.reqSat[i] == checkReqMet){
    		count++;
    	}
    }

     if(EE.includes(userInput)){
	      console.log("found coen reuse");
	      resetEEBox(userInput);
      }

    if (count > 3){
      alert("coen electives already met, will be added to enrichment");
      addEnrich(userInput);
      return;
    }

    reqMet = reqMet + " " + count;
    var tdElement = reqMet + " (" + userInput + ")";
    $( "td:contains('" + reqMet + "')" ).removeClass();
    var button = '<button type="reset" value="reset" onclick="resetElectBox(\''+tdElement+'\')">X</button>'
    $( "td:contains('" + reqMet + "')" ).css("background-color", "#00b33c");
    $( "td:contains('" + reqMet + "')" ).append(" ("+userInput+") "+button);
    
    count++;
  }
  else {
    var tdElement = reqMet + " (" + userInput + ")"
    $("td").filter(function() {return $(this).text() === reqMet;}).removeClass();
    var button = '<button type="reset" value="reset" onclick="resetBox(\''+tdElement+'\')">X</button>'
    //finds user input in html table data, changes color to green
    $("td").filter(function() {return $(this).text() === reqMet;}).css("background-color", "#00b33c");
    //finds user input in html table data, appends the users class to the row
    $("td").filter(function() {return $(this).text() === reqMet;}).append(" ("+userInput+") "+button);
    
  }
  tableObj.reqSat.push(reqMet);
  tableObj.major.push(userInput);

  //console.log(tableObj.major + " *post add coen classes");
 // console.log(tableObj.reqSat + " *req satisfied obj");
}

function addCoreCourse (userInput) {
  var reqMet = coreReq[userInput];
  var numReqMet = coreReq[userInput].length;

  if(numReqMet > 1 && typeof(reqMet)=='object') {
    var flag = 0;
    for(var k=0;k<numReqMet;k++){
      if (coreReqCheck(userInput, reqMet[k])) {
      	
        for(var i = 0; i<tableObj.core.length;i++){
          var course = tableObj.core[i];
          if(coreReq[course] == reqMet[k] && typeof(coreReq[course])!='object'){
            var remTdElem = reqMet[k] + " (" + course + ")";
            resetCoreBox(remTdElem);
            addEnrich(course);
            coreHTMLInject(userInput, reqMet[k]);
          }
             
        }

        continue;
      }

      coreHTMLInject(userInput, reqMet[k]);
    }
  }
  else {
    if (coreReqCheck(userInput, reqMet)) {
      addEnrich(userInput)
      console.log("hitting reAdd");
      return;
    }

    coreHTMLInject(userInput, reqMet);

  }

  tableObj.core.push(userInput);

  console.log(tableObj.core + " *post add core classes");
  //console.log(tableObj.reqSat + " *req satisfied obj");
}

function coreHTMLInject(userInput, reqMet) {
    var tdElement = reqMet + " (" + userInput + ")"
    $("td").filter(function() {return $(this).text() === reqMet;}).removeClass();
    var button = '<button type="reset" value="reset" onclick="resetCoreBox(\''+tdElement+'\')">X</button>'
    //finds user input in html table data, changes color to green
    $("td").filter(function() {return $(this).text() === reqMet;}).css("background-color", "#00b33c");
    //finds user input in html table data, appends the users class to the row
    $("td").filter(function() {return $(this).text() === reqMet;}).append(" ("+userInput+") "+button);
    
    //add classes as they are input to object
    tableObj.reqSat.push(reqMet);
}

function addEnrich(userInput){
  if(EE.includes(userInput)){
    alert("Educational enrichment already added");
    return;
  }
  EE = EE.concat(userInput+", ");
  tableObj.enrich.push(userInput);
  var button = '<button type="reset" value="reset" onclick="resetEEBox(\''+userInput+'\')">X</button>';
  $( "td:empty" ).first().append(userInput + "  " + button);
  console.log(tableObj.enrich)
}

function resetEEBox(userInput){
  //console.log(userInput);
  $( "td:contains('" + userInput + "')" ).text('');
  EE = EE.replace(userInput+",", "")
  var index = tableObj.enrich.indexOf(userInput);
  tableObj.enrich.splice(index, 1);
  console.log(tableObj.enrich)
}

function resetBox(tdElement){
  //console.log(tdElement);
  //gets original tdElement requirement text
  var originalValue = tdElement.split("(");
  //console.log(tdElement);
  var course = originalValue[1].substring(0, originalValue[1].length-1);
  originalValue = originalValue[0].substring(0, originalValue[0].length-1);
  console.log(originalValue);
  //$("td").filter(function() {return $(this).text() === originalValue;}).addClass("thickerBorder");
  $( "td:contains('" + tdElement + "')" ).addClass("thickerBorder");
  $( "td:contains('" + tdElement + "')" ).css("background-color", "#FF6347");
  //$( "td:contains('" + tdElement + "')" ).text('');
  $( "td:contains('" + tdElement + "')" ).text(originalValue);
  //removes item from array
  var index = tableObj.major.indexOf(course);
  tableObj.major.splice(index, 1);
  index = tableObj.reqSat.indexOf(originalValue);
  tableObj.reqSat.splice(index, 1);
  //console.log(tableObj.major);
  console.log(tableObj.major + " *post delete major classes");
  console.log(tableObj.reqSat + " *req satisfied obj");
  //write function to reinitialize box
  $("#tb1 tr").each(function(){
      $(this).find('td').each(function(){
        temp = ($(this));
        if(!temp.hasClass("thickerBorder") && temp.text().trim().length){
          console.log("found temp");
          flag = 1;
          $("td").filter(function() {return $(this).text() === originalValue;}).removeClass();
        }
    })
  });

  enrichReAdd();

}

function resetElectBox(tdElement) {
  var originalValue = tdElement.split("(");
  var majorCourse = originalValue[1].substring(0, originalValue[1].length-1);
  //saves requirement
  originalValue = originalValue[0].substring(0, originalValue[0].length-1);
  $( "td:contains('" + tdElement + "')" ).addClass("thickerBorder");
  $( "td:contains('" + tdElement + "')" ).css("background-color", "#FF6347");
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

  $("#tb1 tr").each(function(){
      $(this).find('td').each(function(){
        temp = ($(this));
        if(!temp.hasClass("thickerBorder") && temp.text().trim().length){
          console.log("found temp");
          flag = 1;
          $("td").filter(function() {return $(this).text() === originalValue;}).removeClass();
        }
    })
  });
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
  //console.log(reqMet);
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
      reqSplit = textSplit[0].substring(0, textSplit[0].length-1);


      $( "td:contains('" + htmlText + "')" ).addClass("thickerBorder");

      $( "td:contains('" + htmlText + "')" ).first().css("background-color", "#FF6347");
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
          if(!temp.hasClass("thickerBorder") && temp.text().trim().length){
            console.log("found temp");
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
    $( "td:contains('" + course + "')" ).first().css("background-color", "#FF6347");
    //$( "td:contains('" + tdElement + "')" ).text('');
    //console.log(originalReq);
    $( "td:contains('" + course + "')" ).first().text(reqSplit);
    

    $("#tb1 tr").each(function(){
        $(this).find('td').each(function(){
          temp = ($(this));
          if(!temp.hasClass("thickerBorder") && temp.text().trim().length){
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

  for(var i = 0; i<tableObj.core.length;i++){
    course = tableObj.core[i];
    if(coreReq[course].indexOf(delReq) > -1){
      //console.log("found the reAdd");
      index = coreReq[course].indexOf(delReq);
      reAdd(course, coreReq[course][index])
    }
  }

  enrichReAdd();
  //console.log(tableObj.reqSat + " req obj");

  // if(flag == 1){
  //   console.log("remove")
  //   $("td").filter(function() {return $(this).text() === reqSplit;}).removeClass();
  // }
}

//function checks if requirement removed can be satisfied by a double dipper that is currently in list 
//will change element removed to satisfied
function reAdd(course, reqMet){
  var tdElement = reqMet + " (" + course + ")";
  var button = '<button type="reset" value="reset" onclick="resetCoreBox(\''+tdElement+'\')">X</button>';
  $("td").filter(function() {return $(this).text() === reqMet;}).removeClass();
  //finds user input in html table data, changes color to green
  $( "td:contains('" + reqMet + "')" ).css("background-color", "#00b33c");
  //finds user input in html table data, appends the users class to the row
  $( "td:contains('" + reqMet + "')" ).append(" ("+course+") "+button);
  //add classes as they are input to object
  tableObj.reqSat.push(reqMet);
  console.log(tableObj.reqSat + " readded reqs");
}

function enrichReAdd (){
  var size = tableObj.enrich.length;
  for(var i=0;i<size;i++){
    var course = tableObj.enrich[i];
    console.log(course);
    if(majorReq[course]){
        console.log("in readd");

        resetEEBox(course);
        addMajorCourse(course);
    }
    else if(coreReq[course]) {
      //console.log("add and remove");
      resetEEBox(course);
      addCoreCourse(course);
    }
    else{
      continue;
    }
  }
}

function majorReqCheck (userInput, reqMet) {
  //if reqMet comes back undefined then requirement not available in list
  if(typeof(reqMet) === 'undefined'){
    //alert("not in major reqs!");
    return true;
  }

  //function $.inArray returns index of value, -1 if not found in array
  if(tableObj.major.includes(userInput)){
    //alert("class: "+ userInput+" already added");
    return true;
  }

  if(tableObj.reqSat.includes(reqMet)){
    //alert("requirment: "+reqMet+" already satisfied");
    return true;
  }

  return false;
}

function coreReqCheck(userInput, reqMet){
  //if reqMet comes back undefined then requirement not available in list
  //console.log(reqMet);
  if(typeof(reqMet) === 'undefined'){
    //alert("not in core reqs!");
    return true;
  }

  if(tableObj.core.includes(userInput)){
    //alert("class: "+ userInput+" already added");
    return true;
  }

  //console.log(reqMet);
  if(tableObj.reqSat.includes(reqMet)){
    //alert("requirment: "+reqMet+" already satisfied");
    return true;
  }

  return false;
}

//enter button function
$(document).keypress(function(ev){
  if (ev.which == 13) {
    textGrab();
  }
});



$(function() {
  $( "#userCourse" ).autocomplete({source: availableClasses});
});


/*

//two dimensional array to keep track of satisfied classes
//figure out how to remove coen electives
//when deleting elective save count number to reset counter to deleted row, check to see if coutner is less than current coutner value
*/
