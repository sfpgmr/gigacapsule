import Slider from '../js/slider.js';
import ipc from 'ipc';
import remote from 'remote';
var fs = require('fs');
import denodeify from '../js/denodeify.js';

var readFile = denodeify(fs.readFile);
var audioCtx = new AudioContext();
var resources = [];

function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
	var view = new Uint8Array(ab);
	var len = buffer.length;
    for (var i = 0; i < len; ++i) {
        view[i] = buffer[i];
    }
   return ab;
}

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
		resources = r;

		var svg = d3.select('body').append('svg')
		.attr({width:1024,height:768});
		// var slider = new Slider(svg,{x:50 + 70,y:768 - 240,domain:[2.0,0.0]});
		// slider.value = 1.0;
		
		
		var promise = Promise.resolve();
		var sources = [];
		
		for(var i = 0;i < 7;++i){
			promise = promise.then(readFile.bind(null,resources[i + 7].path))
			.then((data)=>{
				return new Promise((resolve,reject)=>{
					var ab = toArrayBuffer(data); 
					audioCtx.decodeAudioData(ab,(buffer)=>{
						resolve(buffer);
					},(err)=>{reject(new Error('decodeAudioData():error:'));});
				});
			})
			.then(((idx)=> { 
				return (buffer)=>{
					var source = audioCtx.createBufferSource();
					source.buffer = buffer;
					source.loop = false;
					sources.push(source);
					var gain = audioCtx.createGain();
					source.connect(gain);
					gain.connect(audioCtx.destination);
					var slider = new Slider(svg,{x:50 + idx * 70,y:768 - 240,domain:[2.0,0.0]});
					gain.gain.value = slider.value = 1.0;
					slider.on('change',(v)=>{
						gain.gain.value = v;
					});
				};
			})(i))
			.catch((e)=>{
				console.log(e);
			});				
		}
		
		promise
		.then(()=>{
			console.log('play');
			var current = audioCtx.currentTime + 0.01;
			sources.forEach((s)=>{
				s.start(current);
			});
		});
	 });
		
	
	// var slider = new Slider(svg,{x:50,y:768 - 220});
	// var slider2 = new Slider(svg,{x:120,y:768 - 220});
	// slider.value = 0.5;
}

