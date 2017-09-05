var lastClick = 0;
var h = 0;
var s = 0;
var v = 0;
var delay = 100;
var loaded = 0;
var playing = true;
var ojon = $.getJSON("py/data.json", function(json) {
	ojson = json;
});

var el = document.createElement('script');
el.src = 'py/data.json?nocache=' + (new Date()).getTime();
document.head.appendChild(el);

getColors();
setInterval(getColors, 2000)

function postData(arr) {
	$.ajax({
		type : "POST",
		url : "http://EWALLAT7-32987:5000",
		data : JSON.stringify(arr),
		dataType : "json",
		contentType : 'application/json; charset=utf-8',
		success : function(data) {
			console.log(data);
		}
	});
}

function callbackFunc(response) {
	// do something with the response
	console.log(response);
}

function update(jscolor) {
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
		'preset' : false
	};
	postData(arr);
	playing = false;
}

function getColors() {
	$.getJSON("py/data.json",function(json) {
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
	if (lastClick <= Date.now() - 60000 && !playing) {
		$.ajax({
			type : "POST",
			url : "http://EWALLAT7-32987:5000",
			data : JSON.stringify({
				'play' : true,
				'preset' : false
			}),
			dataType : "json",
			contentType : 'application/json; charset=utf-8',
			success : function(data) {
				console.log(data);
			}
		});
		console.log("play");
		playing = true;
	}
}

function isLight(rgb) {
	rgb = rgb.replace(/[^\d,.]/g, '').split(',');
	var multi = 1;
	if (rgb.length > 3) {
		multi = rgb[3];
	}
	return ((0.213 * rgb[0] + 0.715 * rgb[1] + 0.072 * rgb[2]) * multi > 255 / 2);
}

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

$(".dropdown-item").on("click", event, function() {
	var arr = {};
	switch (event.target.id) {
	case 'usa':
		arr = {
			'chan' : [ [ 13, 12, 9, 1 ], [ 11, 7, 8 ], [ 2, 10, 3, 4, 5, 6 ] ],
			'h1' : 210,
			's1' : 100,
			'v1' : 32,
			'h2' : 0,
			's2' : 0,
			'v2' : 100,
			'h3' : 352,
			's3' : 82,
			'v3' : 48,
			'preset' : true,
			'play' : false
		};
		break;
	case 'can':
		arr = {
			'chan' : [ [ 13, 9, 1, 7, 4, 3, 6, 8 ], [ 12, 11, 2, 10, 5 ] ],
			'h1' : 352,
			's1' : 82,
			'v1' : 48,
			'h2' : 0,
			's2' : 0,
			'v2' : 100,
			'preset' : true,
			'play' : false
		};
		break;
	case 'italy':
		arr = {
			'chan' : [ [ 13, 12, 11, 3 ], [ 9, 1, 2, 10, 8 ], [ 7, 4, 5, 6 ] ],
			'h1' : 120,
			's1' : 100,
			'v1' : 34,
			'h2' : 0,
			's2' : 0,
			'v2' : 100,
			'h3' : 352,
			's3' : 82,
			'v3' : 48,
			'preset' : true,
			'play' : false
		};
		break;
	case 'hk':
		arr = {
			'chan' : [ [ 13, 9, 1, 7, 4, 3, 6, 8 ], [ 12, 11, 2, 10, 5 ] ],
			'h1' : 0,
			's1' : 100,
			'v1' : 50,
			'h2' : 0,
			's2' : 0,
			'v2' : 100,
			'preset' : true,
			'play' : false
		};
		break;
	case 'germ':
		arr = {
			'chan' : [ [ 13, 12, 11, 3 ], [ 9, 1, 2, 10, 8 ], [ 7, 4, 5, 6 ] ],
			'h1' : 0,
			's1' : 0,
			'v1' : 0,
			'h2' : 0,
			's2' : 100,
			'v2' : 50,
			'h3' : 51,
			's3' : 100,
			'v3' : 50,
			'preset' : true,
			'play' : false
		};
		break;
	case 'neth':
		arr = {
			'chan' : [ [ 13, 12, 11, 3 ], [ 9, 1, 2, 10, 8 ], [ 7, 4, 5, 6 ] ],
			'h1' : 0,
			's1' : 100,
			'v1' : 50,
			'h2' : 0,
			's2' : 0,
			'v2' : 100,
			'h3' : 240,
			's3' : 100,
			'v3' : 40,
			'preset' : true,
			'play' : false
		};
		break;
	case 'eng':
		arr = {
			'chan' : [ [ 13, 11, 9, 4, 3 ], [ 1, 7, 6 ], [ 2, 10, 12, 5, 8 ] ],
			'h1' : 210,
			's1' : 100,
			'v1' : 32,
			'h2' : 0,
			's2' : 0,
			'v2' : 100,
			'h3' : 352,
			's3' : 82,
			'v3' : 48,
			'preset' : true,
			'play' : false
		};
		break;

	}
	$.ajax({
		type : "POST",
		url : "http://EWALLAT7-32987:5000",
		data : JSON.stringify(arr),
		dataType : "json",
		contentType : 'application/json; charset=utf-8',
		success : function(data) {
			console.log(data);
		}
	});
	playing = false;
	lastClick = Date.now();

});

window.onresize = resize;

$(document).ready(function() {
	resize();
});