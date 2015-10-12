import Slider from '../js/slider.js';
import ipc from 'ipc';

window.onload = ()=>{
	var mes = d3.select('body')
	.append('h1')
	.classed('mes',true)
	.text('準備中です。少々お待ちください。。');
	
	var id = setInterval((()=>{
		var i = 0;
		return ()=>{
			mes.style('opacity',i);
			i = ++i & 0x1;
		}
	})(),500);
	
	ipc.on('resources',(r)=>{
		clearInterval(id);
		mes.remove();
		var svg = d3.select('body').append('svg')
		.attr({width:1024,height:768});
	
		for(var i = 0;i < 6;++i){
			new Slider(svg,{x:50 + i * 70,y:768 - 240});
		}

		console.log(r);
	});
	
	// var slider = new Slider(svg,{x:50,y:768 - 220});
	// var slider2 = new Slider(svg,{x:120,y:768 - 220});
	// slider.value = 0.5;
}

