'use strict';
import { EventEmitter } from 'events';

class Slider extends EventEmitter {
	constructor(selection,opt){
		super();
		var self = this;
		opt = opt || {};

		this.x = opt.x = opt.x || 0;
		this.y = opt.y = opt.y || 0;

		var drag = d3.behavior.drag()
			.origin(function(d){return d;})
			.on('drag',dragmove);
			
		var yscale = d3.scale.linear()
		.domain(opt.domain || [1.0,0.0])
		.range(opt.range || [0,200])
		.clamp(opt.clamp || true);

		this.yscale = yscale;
		this.value_ = yscale.invert(0);

		var yAxis = d3.svg.axis()
		.tickSize(0)
		.ticks(0)
		.scale(yscale)
		.orient('left');

		this.yAxis = yAxis;
		
		var g = 
			selection.append('g')
			.attr('transform','translate(' + opt.x + ',' + opt.y + ')');

		var slider = g.append('g')
		.attr({'class':'y axis'})
		.call(yAxis);
		
		var handle = slider.selectAll('rect').data([{x:0,y:0}]).enter().append('rect')
		    .attr({'class':'handle','width':50,'height':30,transform:'translate(-25,-15)'})
			.call(drag);
			
		function dragmove(d){
			d.y += d3.event.dy;
			if(d.y < yscale.range()[0] ) d.y = yscale.range()[0];
			if(d.y > yscale.range()[1] ) d.y = yscale.range()[1];
			self.value_ = yscale.invert(d.y);
			self.emit('change',self.value_);
			d3.select(this).attr("y",d.y);
		}
		this.handle = handle;
		
	}

	
	get value (){
		return this.value_;
	}
	
	set value (v) {
		var self = this;
		this.value_ = v;
		this.handle.attr('y',function(d){d.y = self.yscale(v);return d.y;});
		console.log(this.yscale(v));
	}
}
export default Slider;