/**
 * This is the main js file for controlling the
 * project dragon site. It is responsible for sending
 * AJAX requests for changing colors, managing screen
 * resizing, and updating the log information so it is
 * consistent across users.
 *
 * @summary   Project dragon main js file
 *
 * @requires jscolor.js, presets.js
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
 * Updates the selected dragon part colors
 * @param {jscolor object} jscolor 
 */
function dragonSelect(jscolor) {
	h = Math.round(jscolor.hsv[0]);
	s = Math.round(jscolor.hsv[1]);
	v = Math.round(jscolor.hsv[2]);
	if (lastClick >= Date.now() - delay) {
		return;
	}
	lastClick = Date.now();
	channels = [[]];
	switch(jscolor.styleElement.textContent) {
	case 'Head Left':
		channels = [[10]];
		break;
	case 'Left Side':
		channels = [[2,3,8]];
		break;
	case 'Right Side':
		channels = [[7,4,1]];
		break;
	case 'Front':
		channels = [[1,2]];
		break;
	case 'Back':
		channels = [[5,6]];
		break;
	case 'Eyes':
		channels = [[13]];
		break;
	case 'Head Right':
		channels = [[9]];
		break;
	case 'Scales':
		channels = [[12,11]];
		break;
	}
	
	var arr = {
		'chan' : channels,
		'h1' : h,
		's1' : s,
		'v1' : v,
		'play' : false,
		'preset' : true,
		'last' : lastClick,
		'theme' : jscolor.styleElement.textContent
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
		url : "http://dragon:5000",
		data : JSON.stringify(arr),
		dataType : "json",
		contentType : 'application/json; charset=utf-8',
		success : function(data) {
		}
	});
}

/**
 * Updates the log and buttons if they have
 * recently changed.
 */
function update() {
	
	$.getJSON("json/log.json",function(json) {
		if ((JSON.stringify(logjson) != JSON.stringify(json))) {
			for (var i = 0; i < Object.keys(json).length; i++) {
				$("#box").children().eq(i).text(json[i]);
			}
			logjson = json;
		}
	});
	
	$.getJSON("json/data.json",function(json) {
		if ((JSON.stringify(ojson) != JSON.stringify(json)) || loaded == 0) {
			for (var i = 0; i < Object.keys(json).length; i++) {
				$(".dragonpart")[i].children[0].style.backgroundColor = json[$(".dragonpart")[i].children[0].textContent];
				$(".dragonpart")[i].children[0].style.color = isLight(json[$(".dragonpart")[i].children[0].textContent]) ? '#000'
						: '#FFF';
			}
			ojson = json;
			loaded = 1;
		}
	});
}

/**
 * Changes the color of the button text to white
 * or black depending on the background color
 * @param {String} rgb 
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
	