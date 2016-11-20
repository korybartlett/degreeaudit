/*
JS file must be placed in script before other JS files

file contains objects that are used in system 

last array contains classes for possbile autocomplete option
*/

var majorReq = {
  //Expected user Input : Requirement
  //Lower Div COEN Req
  engr1: "engr 1",
  coen10: "coen 10",
  coen11: "coen 11",
  coen12: "coen 12",
  coen19: "coen 19",
  coen20: "coen 20",
  coen21: "coen 21",
  elen21: "coen 21",
  coen70: "coen 70",
  //Upper Div COEN Req
  coen122: "coen 122",
  coen146: "coen 146",
  coen171: "coen 171",
  coen174: "coen 174",
  coen175: "coen 175",
  coen177: "coen 177",
  coen179: "coen 179",
  coen194: "coen 194",
  coen195: "coen 195",
  coen196: "coen 196",
  //coen electives
  coen120: "coen elective",
  coen123: "coen elective",
  coen129: "coen elective",
  coen148: "coen elective",
  coen152: "coen elective",
  coen160: "coen elective",
  coen161: "coen elective",
  coen162: "coen elective",
  coen163: "coen elective",
  coen164: "coen elective",
  coen165: "coen elective",
  coen166: "coen elective",
  coen169: "coen elective",
  coen178: "coen elective",
  coen180: "coen elective",
  elen115: "coen elective",
  elen133: "coen elective",
  elen134: "coen elective",
  //ENGL Reqs
  engl181: "engineering communications",
  //ELEN Reqs
  elen50: "elen 50",
  elen153: "elen 153",
  //Math Reqs
  math11: "math 11",
  math12: "math 12",
  math13: "math 13",
  math14: "math 14",
  //supposed to select one from math53, math166, amth118
  math53: "math elective",
  math166: "math elective",
  amth118: "math elective",
  //following two are cross listed as math22 and math122
  amth106: "amth 106",
  amth108: "amth 108",
  math22: "amth 106",
  math122: "amth 108",
  //phys reqs
  phys31: "phys 31",
  phys32: "phys 32",
  phys33: "phys 33",
  //chem reqs
  chem11: "chem 11"
}

var coreReq = {
  econ1: "social science",
  engl1a: "CTW1",
  engl2a: "CTW1",
  phil2a: "CTW2",
  engl2a: "CTW2",
  engl11a: "CI1",
  art11a: "CI1",
  clas11a: "CI1",
  engl12a: "CI2",
  art12a: "CI2",
  clas12a: "CI2",
  arth152: "CI3",
  poli50: "CI3",
  poli2: ["social science", "CI3"],
  soci135: "CI3",
  rsoc9:"rtc1",
  rsoc10:"rtc1",
  rsoc12:"rtc1",
  tesp4:"rtc1",
  rsoc27:"rtc2",
  rsoc33:"rtc2",
  rsoc99:["rtc2", "experiential learning"],
  tesp71:"rtc2",
  rsoc119: "rtc3",
  rsoc121:"rtc3",
  rsoc154:"rtc3",
  tesp158: ["rtc3", "diversity", "experiential learning"],
  phil2: "ethics",
  phil6: "ethics",
  phil9: "ethics",
  engr19: "ethics",
  psyc1: "social science",
  psyc2: "social science",
  ethn5: "diversity",
  danc62: "diversity",
  ethn30: "diversity",
  musc8: "arts",
  comm30: "arts",
  musc42: "arts",
  engr1: "civic engagement",
  poli1: "civic engagement",
  mgmt6: "civic engagement",
  anth3: "experiential learning",
  elsj22: "experiential learning"
}


//array used for autocomplete functionality
var availableClasses = [
  "engr1",
  "coen10",
  "coen11",
  "coen12",
  "coen19",
  "coen20",
  "coen21",
  "coen70",
  "coen122",
  "coen146",
  "coen171",
  "coen174",
  "coen175",
  "coen177",
  "coen179",
  "coen194",
  "coen195",
  "coen196",
  "coen120",
  "coen123",
  "coen129",
  "coen148",
  "coen152",
  "coen160",
  "coen161",
  "coen162",
  "coen163",
  "coen164",
  "coen165",
  "coen166",
  "coen169",
  "coen178",
  "coen180",
  "elen115",
  "elen133",
  "elen134",
  "engl181",
  "elen21",
  "elen50",
  "elen153",
  "math11",
  "math12",
  "math13",
  "math14",
  "math53",
  "math166",
  "amth118",
  "amth106",
  "amth108",
  "math22",
  "math122",
  "phys31",
  "phys32",
  "phys33",
  "chem11",
  "econ1",
  "engl1a",
  "engl2a",
  "phil2a",
  "engl2a",
  "engl11a",
  "art11a",
  "clas11a",
  "engl12a",
  "art12a",
  "clas12a",
  "arth152",
  "poli50",
  "poli2",
  "soci135",
  "rsoc9",
  "rsoc10",
  "rsoc12",
  "tesp4",
  "rsoc27",
  "rsoc33",
  "rsoc99",
  "tesp71",
  "rsoc119",
  "rsoc121",
  "rsoc154",
  "tesp158",
  "phil2",
  "phil6",
  "phil9",
  "engr19",
  "psyc1",
  "psyc2",
  "ethn5",
  "danc62",
  "ethn30",
  "musc8",
  "comm30",
  "musc42",
  "engr1",
  "poli1",
  "mgmt6",
  "anth3",
  "elsj22",
];