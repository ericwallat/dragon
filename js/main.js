/**
 * This is the main js file for controlling the
 * project dragon site. It is responsible for sending
 * AJAX requests for changing colors, managing screen
 * resizing, and updating the log information so it is
 * consistent across users.
 *
 * @summary   Project dragon main js file
 *
 * @requires jscolor.js, ColorSource.js
 */


/**
 * Updates the selected channel's color
 * @param {jscolor object} jscolor 
 */
function colorSelect(jscolor) {
	h = Math.round(jscolor.hsv[0]);
	s = Math.round(jscolor.hsv[1]);
	v = Math.round(jscolor.hsv[2]);
	if (lastClick >= Date.now() - delay) {
		return;
	}
	lastClick = Date.now();
	var arr = {
		'chan' : jscolor.styleElement.textContent,
		'hue' : h,
		'sat' : s,
		'val' : v,
		'play' : false,
		'preset' : false,
		'last' : lastClick
	};
	postData(arr);
	playing = false;
}

/**
 * Sends AJAX POST request to Python Flask server
 * @param {Object} arr 
 */
function postData(arr) {
	$.ajax({
		type : "POST",
		url : "http://dragon10-33705:5000",
		data : JSON.stringify(arr),
		dataType : "json",
		contentType : 'application/json; charset=utf-8',
		success : function(data) {
		}
	});
}

/**
 * Updates the channel colors and log if they have
 * recently changed.
 */
function update() {
	$.getJSON("json/data.json",function(json) {
				if ((JSON.stringify(ojson) != JSON.stringify(json)) || loaded == 0) {
					for (var i = 0; i < Object.keys(json).length; i++) {
						var jsoni = parseInt($(".noSelect")[i].children[0].textContent);
						$(".noSelect")[i].children[0].style.backgroundColor = json[jsoni];
						$(".noSelect")[i].children[0].style.color = isLight(json[jsoni]) ? '#000'
								: '#FFF';
					}
					ojson = json;
					loaded = 1;
				}
			});
	
	$.getJSON("json/log.json",function(json) {
		if ((JSON.stringify(logjson) != JSON.stringify(json))) {
			for (var i = 0; i < Object.keys(json).length; i++) {
				$("#box").children().eq(i).text(json[i]);
			}
			logjson = json;
		}
	})
}

/**
 * Checks color of button to see if
 * text should be white or black
 * @param {String} rgb 
 * @return {Boolean}
 */
function isLight(rgb) {
	try{
	rgb = rgb.replace(/[^\d,.]/g, '').split(',');
	var multi = 1;
	if (rgb.length > 3) {
		multi = rgb[3];
	}
	return ((0.213 * rgb[0] + 0.715 * rgb[1] + 0.072 * rgb[2]) * multi > 255 / 2);
}catch(e){
	return true;
}
}

/**
 * Changes the channels based on the
 * selected preset theme
 * @param {Event} event 
 */
function themeSelect(event){
	var arr = {};
	lastClick = Date.now();
	switch (event.target.id) {
	case 'USA':
		arr = usa;
		break;
	case 'Canada':
		arr = canada;
		
		break;
	case 'Italy':
		arr = italy;
		
		break;
	case 'HongKong':
		arr = hongkong;
		
		break;
	case 'Germany':
		arr = germany;
		
		break;
	case 'Netherlands':
		arr = netherlands;
		
		break;
	case 'England':
		arr = england;
		
		break;
	case 'Fire':
		arr = fire;
		
		break;
	case 'WinterIsComing':
		arr = winter;
		
		break;
	case 'Dragon':
		arr = dragon;
		
		break;
	case 'Trogdor':
		arr = trogdor;
		
		break;

	}
	arr['last'] = lastClick;
	postData(arr);
}

/**
 * Resizes the channel buttons and video
 * when the window is resized
 */
function resize() {
	var grids = $(".grid-row").length;
	for (var i = 0; i < grids; i++) {
		$(".grid-row").eq(i).height($(".noSelect").eq(0).width());
	}
	var width = $(".split").width() * 0.61;
	var height = width / 1.77777;
	$("#video").attr("width", width);
	$("#video").attr("height", height);

}
	