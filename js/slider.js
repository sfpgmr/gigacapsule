'use strict';
Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

var Slider = (function (_EventEmitter) {
	_inherits(Slider, _EventEmitter);

	function Slider(selection, opt) {
		_classCallCheck(this, Slider);

		_get(Object.getPrototypeOf(Slider.prototype), 'constructor', this).call(this);
		var self = this;
		opt = opt || {};

		this.x = opt.x = opt.x || 0;
		this.y = opt.y = opt.y || 0;

		var yscale = d3.scale.linear().domain(opt.domain || [1.0, 0.0]).range(opt.range || [0, 200]).clamp(opt.clamp || true);

		this.yscale = yscale;

		var brush = d3.svg.brush().y(yscale).extent([0, 0]).on('brush', brushed);
		this.brush = brush;

		var yAxis = d3.svg.axis().tickSize(0).ticks(0).scale(yscale).orient('left');
		this.yAxis = yAxis;

		var g = selection.append('g').attr('transform', 'translate(' + opt.x + ',' + opt.y + ')');

		g.append('g').attr({ 'class': 'y axis' }).call(yAxis);

		var slider = g.append('g').attr('class', 'slider').call(brush);

		this.slider = slider;

		var handle = slider.append('rect').attr({ 'class': 'handle', 'width': 50, 'height': 30, 'x': -25 });
		this.handle = handle;

		slider.call(brush.event);
		function brushed() {
			var value = brush.extent()[0];
			console.log(value);

			if (d3.event.sourceEvent) {
				// not a programmatic event
				value = yscale.invert(d3.mouse(this)[1]);
				brush.extent([value, value]);
			}

			if (self.emit) self.emit('change', value);
			handle.attr("y", yscale(value) - 15);
		}
	}

	_createClass(Slider, [{
		key: 'value',
		get: function get() {
			return this.brush.extent()[0];
		},
		set: function set(v) {
			this.brush.extent([v, v]);
			this.slider.call(this.brush.event);
		}
	}]);

	return Slider;
})(_events.EventEmitter);

exports['default'] = Slider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUIsVUFBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFbkIsT0FBSSxFQUFFLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRTs7QUFDekIsU0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLFNBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM3Qjs7QUFFRCxPQUFHLElBQUksQ0FBQyxJQUFJLEVBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0IsU0FBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0dBQ3JDO0VBQ0Q7O2NBOURJLE1BQU07O09BaUVELGVBQUU7QUFDWCxVQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDOUI7T0FFUyxhQUFDLENBQUMsRUFBRTtBQUNiLE9BQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekIsT0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUNuQzs7O1FBeEVJLE1BQU07OztxQkEwRUcsTUFBTSIsImZpbGUiOiJzbGlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XHJcblxyXG5jbGFzcyBTbGlkZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xyXG5cdGNvbnN0cnVjdG9yKHNlbGVjdGlvbixvcHQpe1xyXG5cdFx0c3VwZXIoKTtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdG9wdCA9IG9wdCB8fCB7fTtcclxuXHJcblx0XHR0aGlzLnggPSBvcHQueCA9IG9wdC54IHx8IDA7XHJcblx0XHR0aGlzLnkgPSBvcHQueSA9IG9wdC55IHx8IDA7XHJcblxyXG5cdFx0dmFyIHlzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXHJcblx0XHQuZG9tYWluKG9wdC5kb21haW4gfHwgWzEuMCwwLjBdKVxyXG5cdFx0LnJhbmdlKG9wdC5yYW5nZSB8fCBbMCwyMDBdKVxyXG5cdFx0LmNsYW1wKG9wdC5jbGFtcCB8fCB0cnVlKTtcclxuXHJcblx0XHR0aGlzLnlzY2FsZSA9IHlzY2FsZTtcclxuXHRcdFxyXG5cdFx0dmFyIGJydXNoID0gZDMuc3ZnLmJydXNoKClcclxuXHRcdFx0LnkoeXNjYWxlKVxyXG5cdFx0XHQuZXh0ZW50KFswLDBdKVxyXG5cdFx0XHQub24oJ2JydXNoJyxicnVzaGVkKTtcclxuXHRcdHRoaXMuYnJ1c2ggPSBicnVzaDtcclxuXHRcdFx0XHJcblx0XHR2YXIgeUF4aXMgPSBkMy5zdmcuYXhpcygpXHJcblx0XHQudGlja1NpemUoMClcclxuXHRcdC50aWNrcygwKVxyXG5cdFx0LnNjYWxlKHlzY2FsZSlcclxuXHRcdC5vcmllbnQoJ2xlZnQnKTtcclxuXHRcdHRoaXMueUF4aXMgPSB5QXhpcztcclxuXHRcdFxyXG5cdFx0dmFyIGcgPSBcclxuXHRcdFx0c2VsZWN0aW9uLmFwcGVuZCgnZycpXHJcblx0XHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCd0cmFuc2xhdGUoJyArIG9wdC54ICsgJywnICsgb3B0LnkgKyAnKScpO1xyXG5cclxuXHRcdGcuYXBwZW5kKCdnJylcclxuXHRcdC5hdHRyKHsnY2xhc3MnOid5IGF4aXMnfSlcclxuXHRcdC5jYWxsKHlBeGlzKTtcclxuXHJcblx0XHR2YXIgc2xpZGVyID0gZy5hcHBlbmQoJ2cnKVxyXG5cdFx0LmF0dHIoJ2NsYXNzJywnc2xpZGVyJylcclxuXHRcdC5jYWxsKGJydXNoKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5zbGlkZXIgPSBzbGlkZXI7XHJcblx0XHRcclxuXHRcdHZhciBoYW5kbGUgPSBzbGlkZXIuYXBwZW5kKCdyZWN0JylcclxuXHRcdC5hdHRyKHsnY2xhc3MnOidoYW5kbGUnLCd3aWR0aCc6NTAsJ2hlaWdodCc6MzAsJ3gnOi0yNX0pO1xyXG5cdFx0dGhpcy5oYW5kbGUgPSBoYW5kbGU7XHJcblxyXG5cdFx0c2xpZGVyXHJcblx0XHRcdC5jYWxsKGJydXNoLmV2ZW50KTtcclxuXHRcdGZ1bmN0aW9uIGJydXNoZWQoKXtcclxuXHRcdFx0dmFyIHZhbHVlID0gYnJ1c2guZXh0ZW50KClbMF07XHJcblx0XHRcdGNvbnNvbGUubG9nKHZhbHVlKTtcclxuXHRcclxuXHRcdFx0aWYgKGQzLmV2ZW50LnNvdXJjZUV2ZW50KSB7IC8vIG5vdCBhIHByb2dyYW1tYXRpYyBldmVudFxyXG5cdFx0XHRcdHZhbHVlID0geXNjYWxlLmludmVydChkMy5tb3VzZSh0aGlzKVsxXSk7XHJcblx0XHRcdFx0YnJ1c2guZXh0ZW50KFt2YWx1ZSwgdmFsdWVdKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYoc2VsZi5lbWl0KVxyXG5cdFx0XHRcdHNlbGYuZW1pdCgnY2hhbmdlJyx2YWx1ZSk7XHJcblx0XHRcdGhhbmRsZS5hdHRyKFwieVwiLCB5c2NhbGUodmFsdWUpIC0gMTUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0XHJcblx0Z2V0IHZhbHVlICgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuYnJ1c2guZXh0ZW50KClbMF07XHJcblx0fVxyXG5cdFxyXG5cdHNldCB2YWx1ZSAodikge1xyXG5cdFx0dGhpcy5icnVzaC5leHRlbnQoW3Ysdl0pO1xyXG5cdFx0dGhpcy5zbGlkZXIuY2FsbCh0aGlzLmJydXNoLmV2ZW50KTtcclxuXHR9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgU2xpZGVyOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
