r express = require("express");
var app = express();
var csv = require("csvtojson");
var _ = require("underscore");
var fs = require('fs'); 

function datetoreport(date){
        // 5 February 2020, Situation Report 16
        var start = new Date("02/05/2020");
        var choice = new Date(date);
        var output = 16 + Math.round((choice-start)/(1000*60*60*24));
        return output
}

app.listen(80, () => {
 console.log("Server running on port 80");
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res, next) => {
	res.sendFile(__dirname + '/index.html');
});

app.get("/api", (req, res, next) => {
	if(typeof req.query.date == "undefined") {
		res.send("Please supply a date");
	}
	else {
		var data = req.query.date;
		var report = datetoreport(data);
		var file = __dirname + "/files/" + report + ".csv";
		fs.stat(file, function(err, stat) {
			if(err == null){
				csv().fromFile(file).then((jsonObj)=>{
  		                	if(typeof req.query.country == "undefined") {
        	                	      res.json(jsonObj);
        	               		}
        	                	else {
        	                        	res.json(_.where(jsonObj, {"Country/Territory": req.query.country}));
        	                	}
               			});
			}
			else {
				res.send("Situation Report for that date does not exist");
			}
		});
	}
});

