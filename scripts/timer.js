var g_dtStart=null;
var g_dtStop=null;
var g_hTimer=null;
var g_counter=1;
var g_records=[];
var g_besttime=0.0;
var g_meantime=0.0;
var g_phase = 0;

var id_div_timer = "divTimernew";
var id_table_records = "tableRecordsnew";
var id_div_besttimer = "divBestnew";
var id_div_bestrecords = "divBesttimenew";
var id_div_timer = "divTimernew";
var id_btn_scramble = "btnScramble";

$(document).ready(function(){

	init();

    document.addEventListener('keydown', function(keyboardEventObject) {
		onKeydown(keyboardEventObject);
    });
  
	document.addEventListener('keyup', function(keyboardEventObject) {
		onKeyup(keyboardEventObject);
	});

	$("#"+id_btn_scramble).click(function() {
		var scramble = makeScramble();
		$( "#divButton" ).text(scramble);
	});

	$("#btnClearall").click(function() {
		resetCookie();
		updateRecords(g_records);
	}); 

	$("#btnClearworst").click(function() {
		var idx = findWorsttimeindex();
		g_records.splice(idx,1);
		updateRecords(g_records);
	})
})

// load info from cookie and init the settings
function init() {

	// load records
    var cuberecords = getCookie("cuberecords");
    if (cuberecords != "") {
        g_records = JSON.parse(cuberecords);
	    updateRecords(g_records); 
	}

	// update mean
	updateMean(g_records);

	// load best time
	var best = getCookie("besttime");
	if (best != "") {
		g_besttime = JSON.parse(best);
		$("#"+id_div_besttimer).text(g_besttime)
	}
}

function onKeydown(event) {
	//console.log("keydown ....");
	var KeyID = event.keyCode;
	if (KeyID == 32) {
		if (g_phase == 0) {
			$("#"+id_div_timer).text("0.00");
			$("#"+id_div_timer).css("color", "green");
			g_hTimer=null;
			g_phase = 1;
		} else {
			if (g_phase == 2) {
				console.log("keydown ....");
				g_dtStop = new Date();
				var diff = ((g_dtStop - g_dtStart)/1000).toFixed(2);
				// add to record list
				g_records.push(diff);

				var diffText = diff.toString();
				var counter = g_counter.toString();
				g_counter = g_counter + 1;

				if ($("#"+ id_table_records).find("tr").length < 4) {
					$("#"+ id_table_records).append("<tr><td>"+ counter +"</td><td>"+ diffText +"</td></tr>");
				} else {
					$("<tr><td>"+ counter +"</td><td>"+ diffText +"</td></tr>").insertBefore($("#"+ id_table_records +" tr:nth(3)"));
				}

				$("#"+id_div_timer).text(diff);

				if (g_besttime == 0) {
					g_besttime = diff;
				} else {
					if (g_besttime > diff) {
						g_besttime = diff;
						//alert("new record!")
					}
				}
				$("#"+id_div_besttimer).text("Best: "+ g_besttime.toString());
				$("#"+id_div_bestrecords).text(g_besttime.toString());

				if (g_hTimer != null) {
					clearInterval(g_hTimer);
					g_hTimer = null;
				}
				g_phase = 3;
			}
		}
	}
}

function onKeyup(event) {
	//console.log("keyup ....");
	var KeyID = event.keyCode;
	if (KeyID == 32) {
		if (g_phase == 1) {
			$("#"+id_div_timer).css("color", "red");
			g_dtStart = new Date();
			g_hTimer = setInterval(mytimer, 100)
			g_phase = 2;
		} else { 
			// save records
			var json = JSON.stringify(g_records);
			setCookie("cuberecords", json);

			var bestjson = JSON.stringify(g_besttime)
			setCookie("besttime", bestjson)

			updateMean(g_records);
			g_phase = 0;
		}
	}
}

function findWorsttimeindex() {
	var w=0.0;
	var idx=-1;
	for (var i=0; i<g_records.length; i++) {
		if (w < parseFloat(g_records[i])) {
			w = parseFloat(g_records[i]);
			idx=i;
		}
	}
	return idx;
}	
function mytimer() {
	var dtCurrent = new Date();
	var dtCurrent = ((dtCurrent-g_dtStart)/1000).toFixed(2);
	var diffText = dtCurrent.toString();
	$("#"+id_div_timer).text(diffText)
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
	g_records=[];
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

// recordlist - array of g_records in string
function updateMean(recordlist) {
	var recordlist = [];
	g_records.forEach(function(value) {
		recordlist.push(parseFloat(value));
	});

	g_meantime = calculateMean(recordlist);
	$("#divMeantime").text(g_meantime.toString());

}

function updateRecords(recordlist) {
	$("#divDiffTime").html("");
	g_counter = 1;
	for (var i = 0; i < recordlist.length; i++) {
		var msg = "<div>"+g_counter.toString() + ". " + recordlist[i] + "s</div>";
		g_counter = g_counter + 1;
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

