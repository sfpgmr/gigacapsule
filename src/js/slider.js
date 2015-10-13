'use strict';
import { EventEmitter } from 'events';

class Slider extends EventEmitter {
	constructor(selection,opt){
		super();
		var self = this;
		opt = opt || {};

		this.x = opt.x = opt.x || 0;
		this.y = opt.y = opt.y || 0;

		var yscale = d3.scale.linear()
		.domain(opt.domain || [1.0,0.0])
		.range(opt.range || [0,200])
		.clamp(opt.clamp || true);

		this.yscale = yscale;
		
		var brush = d3.svg.brush()
			.y(yscale)
			.extent([0,0])
			.on('brush',brushed);
		this.brush = brush;
			
		var yAxis = d3.svg.axis()
		.tickSize(0)
		.ticks(0)
		.scale(yscale)
		.orient('left');
		this.yAxis = yAxis;
		
		var g = 
			selection.append('g')
			.attr('transform','translate(' + opt.x + ',' + opt.y + ')');

		g.append('g')
		.attr({'class':'y axis'})
		.call(yAxis);

		var slider = g.append('g')
		.attr('class','slider')
		.call(brush);
		
		this.slider = slider;
		
		var handle = slider.append('rect')
		.attr({'class':'handle','width':50,'height':30,'x':-25});
		this.handle = handle;

		slider
			.call(brush.event);
		function brushed(){
			var value = brush.extent()[0];
			console.log(value);
	
			if (d3.event.sourceEvent) { // not a programmatic event
				value = yscale.invert(d3.mouse(this)[1]);
				brush.extent([value, value]);
			}

			if(self.emit)
				self.emit('change',value);
			handle.attr("y", yscale(value) - 15);
		}
	}

	
	get value (){
		return this.brush.extent()[0];
	}
	
	set value (v) {
		this.brush.extent([v,v]);
		this.slider.call(this.brush.event);
	}
}
export default Slider;