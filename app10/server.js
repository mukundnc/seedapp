var fs = require('fs');

var rootDir = "/Users/vishal/work/CV_OUT/";

var start = 848;
var end = 3272;
var i = 1;
var missing = 0;

while(i <= end){
	var fName = 'r' + i + ".txt";
	var fPath = rootDir + fName;
	var text = fs.readFileSync(fPath);
	var s = '{ \"name\" : \"' + fName + '\", \"content\" : \"' + text + '\" }';
	
	try{
		JSON.parse(s);
	}
	catch(e){
		console.log(e);
		console.log(fName);
		missing++
	}
	i++;
}

console.log("missing = " + missing);