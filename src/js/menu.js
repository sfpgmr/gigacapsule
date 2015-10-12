'use strict';
import ipc from 'ipc';
import player from '../js/browserPlayer.js';

window.onload = ()=> {
	
	d3.select('html')
	.classed('open',true);
	
	player();
	var audioResources = [];
	ipc.on('audioResource',(paths)=>{
		paths.forEach((path)=>{
			var res = d3.select('body')
			.append('audio')
			.attr({ src: path, preload: 'auto' });
			audioResources.push(res);
		});	
	});

	d3.selectAll('body > div > button')
	.each(function(){
		d3.select(this)
		.on('mouseenter',function(){
			audioResources[1].node().play();	
		})
		.on('click',function(){
			audioResources[0].node().play();	
			d3.select('html').classed({'open':false,'close':true});
			ipc.send('click',d3.select(this).attr('id'));
		});
	});
};