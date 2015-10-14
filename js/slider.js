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

		var drag = d3.behavior.drag().origin(function (d) {
			return d;
		}).on('drag', dragmove);

		var yscale = d3.scale.linear().domain(opt.domain || [1.0, 0.0]).range(opt.range || [0, 200]).clamp(opt.clamp || true);

		this.yscale = yscale;
		this.value_ = yscale.invert(0);

		var yAxis = d3.svg.axis().tickSize(0).ticks(0).scale(yscale).orient('left');

		this.yAxis = yAxis;

		var g = selection.append('g').attr('transform', 'translate(' + opt.x + ',' + opt.y + ')');

		var slider = g.append('g').attr({ 'class': 'y axis' }).call(yAxis);

		var handle = slider.selectAll('rect').data([{ x: 0, y: 0 }]).enter().append('rect').attr({ 'class': 'handle', 'width': 50, 'height': 30, transform: 'translate(-25,-15)' }).call(drag);

		function dragmove(d) {
			d.y += d3.event.dy;
			if (d.y < yscale.range()[0]) d.y = yscale.range()[0];
			if (d.y > yscale.range()[1]) d.y = yscale.range()[1];
			self.value_ = yscale.invert(d.y);
			self.emit('change', self.value_);
			d3.select(this).attr("y", d.y);
		}
		this.handle = handle;
	}

	_createClass(Slider, [{
		key: 'value',
		get: function get() {
			return this.value_;
		},
		set: function set(v) {
			var self = this;
			this.value_ = v;
			this.handle.attr('y', function (d) {
				d.y = self.yscale(v);return d.y;
			});
			console.log(this.yscale(v));
		}
	}]);

	return Slider;
})(_events.EventEmitter);

exports['default'] = Slider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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TUFBTSIsImZpbGUiOiJzbGlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XHJcblxyXG5jbGFzcyBTbGlkZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xyXG5cdGNvbnN0cnVjdG9yKHNlbGVjdGlvbixvcHQpe1xyXG5cdFx0c3VwZXIoKTtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdG9wdCA9IG9wdCB8fCB7fTtcclxuXHJcblx0XHR0aGlzLnggPSBvcHQueCA9IG9wdC54IHx8IDA7XHJcblx0XHR0aGlzLnkgPSBvcHQueSA9IG9wdC55IHx8IDA7XHJcblxyXG5cdFx0dmFyIGRyYWcgPSBkMy5iZWhhdmlvci5kcmFnKClcclxuXHRcdFx0Lm9yaWdpbihmdW5jdGlvbihkKXtyZXR1cm4gZDt9KVxyXG5cdFx0XHQub24oJ2RyYWcnLGRyYWdtb3ZlKTtcclxuXHRcdFx0XHJcblx0XHR2YXIgeXNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcclxuXHRcdC5kb21haW4ob3B0LmRvbWFpbiB8fCBbMS4wLDAuMF0pXHJcblx0XHQucmFuZ2Uob3B0LnJhbmdlIHx8IFswLDIwMF0pXHJcblx0XHQuY2xhbXAob3B0LmNsYW1wIHx8IHRydWUpO1xyXG5cclxuXHRcdHRoaXMueXNjYWxlID0geXNjYWxlO1xyXG5cdFx0dGhpcy52YWx1ZV8gPSB5c2NhbGUuaW52ZXJ0KDApO1xyXG5cclxuXHRcdHZhciB5QXhpcyA9IGQzLnN2Zy5heGlzKClcclxuXHRcdC50aWNrU2l6ZSgwKVxyXG5cdFx0LnRpY2tzKDApXHJcblx0XHQuc2NhbGUoeXNjYWxlKVxyXG5cdFx0Lm9yaWVudCgnbGVmdCcpO1xyXG5cclxuXHRcdHRoaXMueUF4aXMgPSB5QXhpcztcclxuXHRcdFxyXG5cdFx0dmFyIGcgPSBcclxuXHRcdFx0c2VsZWN0aW9uLmFwcGVuZCgnZycpXHJcblx0XHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCd0cmFuc2xhdGUoJyArIG9wdC54ICsgJywnICsgb3B0LnkgKyAnKScpO1xyXG5cclxuXHRcdHZhciBzbGlkZXIgPSBnLmFwcGVuZCgnZycpXHJcblx0XHQuYXR0cih7J2NsYXNzJzoneSBheGlzJ30pXHJcblx0XHQuY2FsbCh5QXhpcyk7XHJcblx0XHRcclxuXHRcdHZhciBoYW5kbGUgPSBzbGlkZXIuc2VsZWN0QWxsKCdyZWN0JykuZGF0YShbe3g6MCx5OjB9XSkuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxyXG5cdFx0ICAgIC5hdHRyKHsnY2xhc3MnOidoYW5kbGUnLCd3aWR0aCc6NTAsJ2hlaWdodCc6MzAsdHJhbnNmb3JtOid0cmFuc2xhdGUoLTI1LC0xNSknfSlcclxuXHRcdFx0LmNhbGwoZHJhZyk7XHJcblx0XHRcdFxyXG5cdFx0ZnVuY3Rpb24gZHJhZ21vdmUoZCl7XHJcblx0XHRcdGQueSArPSBkMy5ldmVudC5keTtcclxuXHRcdFx0aWYoZC55IDwgeXNjYWxlLnJhbmdlKClbMF0gKSBkLnkgPSB5c2NhbGUucmFuZ2UoKVswXTtcclxuXHRcdFx0aWYoZC55ID4geXNjYWxlLnJhbmdlKClbMV0gKSBkLnkgPSB5c2NhbGUucmFuZ2UoKVsxXTtcclxuXHRcdFx0c2VsZi52YWx1ZV8gPSB5c2NhbGUuaW52ZXJ0KGQueSk7XHJcblx0XHRcdHNlbGYuZW1pdCgnY2hhbmdlJyxzZWxmLnZhbHVlXyk7XHJcblx0XHRcdGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwieVwiLGQueSk7XHJcblx0XHR9XHJcblx0XHR0aGlzLmhhbmRsZSA9IGhhbmRsZTtcclxuXHRcdFxyXG5cdH1cclxuXHJcblx0XHJcblx0Z2V0IHZhbHVlICgpe1xyXG5cdFx0cmV0dXJuIHRoaXMudmFsdWVfO1xyXG5cdH1cclxuXHRcclxuXHRzZXQgdmFsdWUgKHYpIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdHRoaXMudmFsdWVfID0gdjtcclxuXHRcdHRoaXMuaGFuZGxlLmF0dHIoJ3knLGZ1bmN0aW9uKGQpe2QueSA9IHNlbGYueXNjYWxlKHYpO3JldHVybiBkLnk7fSk7XHJcblx0XHRjb25zb2xlLmxvZyh0aGlzLnlzY2FsZSh2KSk7XHJcblx0fVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFNsaWRlcjsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
