'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jsSliderJs = require('../js/slider.js');

var _jsSliderJs2 = _interopRequireDefault(_jsSliderJs);

var _ipc = require('ipc');

var _ipc2 = _interopRequireDefault(_ipc);

window.onload = function () {
	var mes = d3.select('body').append('h1').classed('mes', true).text('準備中です。少々お待ちください。。');

	var id = setInterval((function () {
		var i = 0;
		return function () {
			mes.style('opacity', i);
			i = ++i & 0x1;
		};
	})(), 500);

	_ipc2['default'].on('resources', function (r) {
		clearInterval(id);
		mes.remove();
		var svg = d3.select('body').append('svg').attr({ width: 1024, height: 768 });

		for (var i = 0; i < 6; ++i) {
			new _jsSliderJs2['default'](svg, { x: 50 + i * 70, y: 768 - 240 });
		}

		console.log(r);
	});

	// var slider = new Slider(svg,{x:50,y:768 - 220});
	// var slider2 = new Slider(svg,{x:120,y:768 - 220});
	// slider.value = 0.5;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbWl4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7MEJBQW1CLGlCQUFpQjs7OzttQkFDcEIsS0FBSzs7OztBQUVyQixNQUFNLENBQUMsTUFBTSxHQUFHLFlBQUk7QUFDbkIsS0FBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUNaLE9BQU8sQ0FBQyxLQUFLLEVBQUMsSUFBSSxDQUFDLENBQ25CLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUUzQixLQUFJLEVBQUUsR0FBRyxXQUFXLENBQUMsQ0FBQyxZQUFJO0FBQ3pCLE1BQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLFNBQU8sWUFBSTtBQUNWLE1BQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLElBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7R0FDZCxDQUFBO0VBQ0QsQ0FBQSxFQUFHLEVBQUMsR0FBRyxDQUFDLENBQUM7O0FBRVYsa0JBQUksRUFBRSxDQUFDLFdBQVcsRUFBQyxVQUFDLENBQUMsRUFBRztBQUN2QixlQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEIsS0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2IsTUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQ3hDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsTUFBTSxFQUFDLEdBQUcsRUFBQyxDQUFDLENBQUM7O0FBRS9CLE9BQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsRUFBRSxDQUFDLEVBQUM7QUFDdkIsK0JBQVcsR0FBRyxFQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFDLENBQUMsRUFBQyxHQUFHLEdBQUcsR0FBRyxFQUFDLENBQUMsQ0FBQztHQUM1Qzs7QUFFRCxTQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsQ0FBQyxDQUFDOzs7OztDQUtILENBQUEiLCJmaWxlIjoicmVtaXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2xpZGVyIGZyb20gJy4uL2pzL3NsaWRlci5qcyc7XHJcbmltcG9ydCBpcGMgZnJvbSAnaXBjJztcclxuXHJcbndpbmRvdy5vbmxvYWQgPSAoKT0+e1xyXG5cdHZhciBtZXMgPSBkMy5zZWxlY3QoJ2JvZHknKVxyXG5cdC5hcHBlbmQoJ2gxJylcclxuXHQuY2xhc3NlZCgnbWVzJyx0cnVlKVxyXG5cdC50ZXh0KCfmupblgpnkuK3jgafjgZnjgILlsJHjgIXjgYrlvoXjgaHjgY/jgaDjgZXjgYTjgILjgIInKTtcclxuXHRcclxuXHR2YXIgaWQgPSBzZXRJbnRlcnZhbCgoKCk9PntcclxuXHRcdHZhciBpID0gMDtcclxuXHRcdHJldHVybiAoKT0+e1xyXG5cdFx0XHRtZXMuc3R5bGUoJ29wYWNpdHknLGkpO1xyXG5cdFx0XHRpID0gKytpICYgMHgxO1xyXG5cdFx0fVxyXG5cdH0pKCksNTAwKTtcclxuXHRcclxuXHRpcGMub24oJ3Jlc291cmNlcycsKHIpPT57XHJcblx0XHRjbGVhckludGVydmFsKGlkKTtcclxuXHRcdG1lcy5yZW1vdmUoKTtcclxuXHRcdHZhciBzdmcgPSBkMy5zZWxlY3QoJ2JvZHknKS5hcHBlbmQoJ3N2ZycpXHJcblx0XHQuYXR0cih7d2lkdGg6MTAyNCxoZWlnaHQ6NzY4fSk7XHJcblx0XHJcblx0XHRmb3IodmFyIGkgPSAwO2kgPCA2OysraSl7XHJcblx0XHRcdG5ldyBTbGlkZXIoc3ZnLHt4OjUwICsgaSAqIDcwLHk6NzY4IC0gMjQwfSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc29sZS5sb2cocik7XHJcblx0fSk7XHJcblx0XHJcblx0Ly8gdmFyIHNsaWRlciA9IG5ldyBTbGlkZXIoc3ZnLHt4OjUwLHk6NzY4IC0gMjIwfSk7XHJcblx0Ly8gdmFyIHNsaWRlcjIgPSBuZXcgU2xpZGVyKHN2Zyx7eDoxMjAseTo3NjggLSAyMjB9KTtcclxuXHQvLyBzbGlkZXIudmFsdWUgPSAwLjU7XHJcbn1cclxuXHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
