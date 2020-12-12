var g_isStarted=false;
var dtStart=null;
var dtStop=null;
var hTimer=null;
var counter=1;
var records=[];
var besttime=0.0;
var worsttime=0.0;
var meantime=0.0;
var phase = 0;
// test
$(document).ready(function(){

	$("#divBesttime").text(besttime.toString());
	
	// check cookie
    var cuberecords = getCookie("cuberecords");
    if (cuberecords != "") {
        records = JSON.parse(cuberecords);
	    updateRecords(records); 
	}

	updateMean(records);

	var best = getCookie("besttime");
	if (best != "") {
		besttime = JSON.parse(best);
		$("#divBesttime").text(besttime)
	}	
    document.addEventListener('keydown', function(keyboardEventObject) {
		//console.log("keydown ....");
		var KeyID = keyboardEventObject.keyCode;
		if (KeyID == 32) {
			if (g_isStarted == false) {
				$("#divTimer").text("0.00");
				$("#divTimer").css("color", "green");
				hTimer=null;
				phase = 1;
			} else {
				if (phase == 2) {
				console.log("keydown ....");
				dtStop = new Date();
				var diff = ((dtStop - dtStart)/1000).toFixed(2);
				// add to record list
				records.push(diff);

				var diffText = diff.toString();
				
				var msg = "<div>"+counter.toString() + ". " + diffText + "s</div>";
				counter = counter + 1;

				$("#divDiffTime").prepend(msg);

				$("#divTimer").text(diff);

				// if (diff < 10){
					// alert("sub 10!");
				// }
								
                if (besttime == 0) {
					besttime = diff;
				} else {
					if (besttime > diff) {
						besttime = diff;
						//alert("new record!")
					}
				}
				$("#divBesttime").text(besttime.toString());

				if (hTimer != null) {
					clearInterval(hTimer);
					hTimer = null;
				}
                phase = 3;
			 }
		   }
		}
    });
  
	document.addEventListener('keyup', function(keyboardEventObject) {
		console.log("keyup ....");
		var KeyID = keyboardEventObject.keyCode;
		if (KeyID == 32) {
			if (g_isStarted == false) {
				$("#divTimer").css("color", "red");
				dtStart = new Date();
				hTimer = setInterval(mytimer, 100)
				g_isStarted = true; 
				phase = 2;
			} else {
				g_isStarted = false; 
				// save records

				var json = JSON.stringify(records);
				setCookie("cuberecords", json);

				var bestjson = JSON.stringify(besttime)
				setCookie("besttime", bestjson)

				updateMean(records);
				phase = 0;
			}
		}
	});
	document.addEventListener('keypress', function(keyboardEventObject) {
		//console.log("keypress ....");
	}); 

	$("#btnScramble").click(function() {
		var scramble = makeScramble();
		//alert( scramble );
		$( "#divButton" ).text(scramble);
	});

	$("#divMeantime").text(meantime.toString())

		
	$("#btnClearall").click(function() {
		resetCookie();
		updateRecords(records);
	}); 

	$("#btnClearworst").click(function() {
		var idx = findWorsttimeindex();
		records.splice(idx,1);
		updateRecords(records);
	})

})

function findWorsttimeindex() {
	var w=0.0;
	var idx=-1;
	for (var i=0; i<records.length; i++) {
		if (w < parseFloat(records[i])) {
			w = parseFloat(records[i]);
			idx=i;
		}
	}
	return idx;
}	
function mytimer() {
	var dtCurrent = new Date();
	var dtCurrent = ((dtCurrent-dtStart)/1000).toFixed(2);
	var diffText = dtCurrent.toString();
	$("#divTimer").text(diffText)
}

function setCookie(cookieName,cookieValue){
	var date = new Date();
	var daysToExpire = 365;
	date.setTime(date.getTime()+(daysToExpire*24*60*60*1000));
	document.cookie = cookieName + "=" + cookieValue + "; expires=" + date.toGMTString();
}

function resetCookie (){
	setCookie("cuberecords", "[]");
	setCookie("besttime", "0");
	records=[];
}

function getCookie(cookieName){
  var name = cookieName + "=";
  var allCookieArray = document.cookie.split(';');
  for(var i=0; i<allCookieArray.length; i++)
  {
    var temp = allCookieArray[i].trim();
    if (temp.indexOf(name)==0) {
	    return temp.substring(name.length,temp.length);
	}
  }
	return "";
}

// recordlist - array of records in string
function updateMean(recordlist) {
	var recordlist = [];
	records.forEach(function(value) {
		recordlist.push(parseFloat(value));
	});

	meantime = calculateMean(recordlist);
	$("#divMeantime").text(meantime.toString());

}

function updateRecords(recordlist) {
	$("#divDiffTime").html("");
	counter = 1;
	for (var i = 0; i < recordlist.length; i++) {
		var msg = "<div>"+counter.toString() + ". " + recordlist[i] + "s</div>";
		counter = counter + 1;
		$("#divDiffTime").prepend(msg);
	}
}
// calculate mean value
// recordArray - is an array of records
function calculateMean(recordArray){
	var mean = 0.0;
	if (recordArray != null && recordArray.length > 0) {
	    var sum = 0.0;
        for(var i = 0; i < recordArray.length; i++) {
		    sum = sum + recordArray[i];	
	    }
	    mean = sum / recordArray.length;
    }
	return mean.toFixed(2);
}

function makeScramble() {
	var options = ["F", "R", "U", "B", "L", "D", "F2", "R2", "U2", "B2", "L2", "D2", "F'", "R'", "U'", "B'", "L'", "D'"]
	var scramble = []
	var j = "";

	for (var i = 0; i < 20; i++) {
		scramble.push(options[getRandomInt(18)])

	}
	for (var i = 0; i < 20; i++) {
		j = j + scramble[i] + " ";
	}
	return j;


}

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

