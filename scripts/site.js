/* =============================
   Main javascript
 ============================= */
$(document).ready(function(){
	
	$("#lnkFish").click(function(){
		$('#divFish').hide();
		$('#divLinks').hide();
		$('#divSnail').hide();
		$('#divTetra').hide();
		$('#divFish').show();
	});
	
	$("#lnkLinks").click(function(){
		$('#divFish').hide();
		$('#divLinks').hide();
		$('#divSnail').hide();
		$('#divTetra').hide();
		$('#divLinks').show();
	});
	
	$("#lnkSnail").click(function(){
		$('#divFish').hide();
		$('#divLinks').hide();
		$('#divSnail').hide();
		$('#divTetra').hide();
		$('#divSnail').show();
	});
	
		$("#lnkTetra").click(function(){
		$('#divFish').hide();
		$('#divLinks').hide();
		$('#divSnail').hide();
		$('#divTetra').hide();
		$('#divTetra').show();
		
	});
	
	$("#lnkSquirrels").click(function(){
		alert('Oop! Under construction');
	});
	
	$("#lnkRabbits").click(function(){
		alert('Oop! Under construction');
	});
	
	$('#lnkFish').trigger('click');
	
	setInterval(function(){
	    var d = new Date();
		var n = d.getMilliseconds();
	    $('#spTimer').text(d);
	}, 1000);
 	
	document.addEventListener('keypress', function(e) {
		var KeyID = e.keyCode;
		switch(KeyID)
		{
			case 32:
				alert("Space");
				break;
			case 13:
				alert("Enter");
				break;
			default:
				break;
		}
	});
});