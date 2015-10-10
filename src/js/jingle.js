'use strict';
import denodeify from '../js/denodeify.js';
import ipc from 'ipc';
import remote from 'remote';
import { EventEmitter } from 'events';
 
var fs = remote.require('fs');
var readFile = denodeify(fs.readFile);

ipc.on('playVideo', function (path) {
    d3.select('body')
		.append('video')
		.attr({ src: path, width: '100%', height: '100%', autoplay: 'autoplay', autobuffer: 'autobuffer' })
		.on('ended', function () {
			d3.select(this).remove();
			ipc.send('playVideoEnd', path);
		});
});

function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}
ipc.on('play',function(path){
	playContents(path);
});

var audioCtx;
	var lylics = [
		'Ha hahaha...',
		'おかしい ハッハッハッハ',
		'Snake is here.',
		'Music music music music show!',
		'Oh, the hottest thing of the world!',
		'Of the world... Oh!',
		'Yellow Magic Orchestra!!',
		'Music... Music... Y M O',
		'YMO ready to lay on you!',
		'Nice age.'		
	];


var svg; //d3.select('body').append('svg').attr({'width':'1024px','height':'768px'});
			
window.onload = ()=>{
	// 初期化完了
	audioCtx = new AudioContext();
}

class Track extends EventEmitter {
	constructor(array)
	{
		super();
		this.seqData = array;
		this.seqCounter = 0;
	}
	
	sequence(currentTime) {
		var len = this.seqData.length;
		while (len > this.seqCounter) {
			var seq = this.seqData[this.seqCounter];
			if (seq[0] <= currentTime) {
				seq[1](currentTime);
				++this.seqCounter;
			} else {
				return;
			}
			if(len <= this.seqCounter){
				this.emit('end');
			}
		}
	}
};

class Tracks extends EventEmitter {
	constructor(){
		super();
		this.tracks = [];
		this.endTrackCount = 0;
		this.end = false;
	}
	
	addTrack(array){
		var track = new Track(array);
		this.tracks.push(track);
		track.on('end',()=>{
			++this.endTrackCount;
			if(this.endTrackCount == this.tracks.length){
				this.emit('end');
				this.end = true;
			}			
		});
	}
	
	sequence(currentTime){
		this.tracks.forEach((track)=>{
			track.sequence(currentTime);
		});
	}
}

var tracks = new Tracks();

var seqData = [
	// seqtime anim
[1.025,hihat],
[1.422,hihat],
[1.819,hihat],
[2.216,hihat],
[2.613,hihat],
[3.01,hihat],
[3.407,hihat],
[3.804,hihat],
[4.201,hihat],
[4.598,hihat],
[4.995,hihat],
[5.392,hihat],
[5.789,hihat],
[6.186,hihat],
[6.583,hihat],
[6.98,hihat],
[7.377,hihat],
[7.774,hihat],
[8.171,hihat],
[8.568,hihat],
[8.965,hihat],
[9.362,hihat],
[9.759,hihat],
[10.156,hihat],
[10.553,hihat],
[10.95,hihat],
[11.347,hihat],
[11.744,hihat],
[12.141,hihat],
[12.538,hihat],
[12.935,hihat],
[13.332,hihat],
[13.729,hihat],
[14.126,hihat],
[14.523,hihat],
[14.92,hihat],
[15.317,hihat],
[15.714,hihat]
];

tracks.addTrack(seqData);
tracks.addTrack([
[2.541,bass],
[2.6,bass], 
[2.939,bass],
[3.580,bass],
[4.194,bass],
[4.538,bass],
[4.791,bass],
[5.120,bass],
[5.373,bass],
[5.712,bass],
[5.997,bass],
[6.309,bass],
[6.573,bass],
[6.579,bass],
[9.373,bass],
[9.503,bass],
[9.892,bass],
[11.350,bass],
[11.650,bass],
[12.478,bass],
[12.941,bass],
[13.270,bass],
[14.055,bass],
[14.467,bass],
[14.527,bass],
[15.095,bass],
[15.663,bass]
]);

tracks.addTrack([
	[4.198,text(10,150,'Music','red','160px','sagoe')],
	[4.838,text(500,200,'Music','red','140px')],
	[5.394,text(200,250,'Music','red','130px')],
	[5.980,text(600,300,'Music','red','120px')],
	[6.775,text(200,500,'Show!','red','240px')],
	[11.343,text(200,400,'Music','red','240px')],
	[12.941,text(200,600,'Music','red','240px')],
	[14.518,text(250,550,'Y','red','580px')],
	[15.117,text(250,550,'M','red','580px')],
	[15.713,text(250,550,'O','red','580px')]
]);

var fontCache;

function text(x,y,mes,color,size,font){
	return () => {
		fontCache = font || fontCache || '';
		svg.append('text')
			.attr({x:x,y:y,fill:color,opacity:1.0})
			.style({'font-size':size,'font-family':fontCache})
			.text(mes)
			.transition()
			.duration(1000)
			.attr({opacity:0.0})
			.remove();
	};
}

function bass()
{
	var x = 512,
		y = 384;
	var g = svg
	.append('g');
	
	g.attr({transform:'translate(' + x + ' '  + y  + ')'})
	.transition()
	.delay(500)
	.remove();
	
	var colors = ['white','red','blue','green','magenta','yellow'];
	var color = colors[(Math.random() * 6) | 0];
    g.append('ellipse')
	.attr({
		rx:680,ry:680,
		cx:0,cy:0,
		'stroke-width':0,
		fill:color,
		opacity:0.5
	})
	.transition()
	.duration(250)
	.attr({opacity:0.0,rx:0,ry:0});
}

function hihat(){
	var g = svg
	.append('g');
	var x = Math.random() * (1024 - 400);
	var y = Math.random() * (768 - 100) + 50;
    var r = 40;
	var colors = ['white','red','blue','green','magenta','yellow'];
	var color = colors[(Math.random() * 6) | 0];
	g.attr('transform','translate(' + x + ' ' + y + ')');
	g.append('ellipse')
	.attr({
		rx:r,ry:r,
		cx:0,cy:0,
		'stroke-width':0,
		fill:color,
		opacity:0.6
		})
	.transition()
	.duration(200)
	.attr({cx:150,rx:r * 2.5});
	
	g.append('ellipse')
	.attr({
		rx:r,ry:r,
		cx:300,cy:0,
		'stroke-width':0,
		fill:color,
		opacity:0.0
		})
	.transition()
	.delay(200)
	.attr('opacity',0.6);

	g.append('ellipse')
	.attr({
		rx:r,ry:r,
		cx:400,cy:0,
		'stroke-width':0,
		fill:color,
		opacity:0.0
		})
	.transition()
	.delay(332)
	.attr('opacity',0.6);

	var x = Math.random() * 1024;
	var y = Math.random() * 768;
	
	g.attr({opacity:0.5})
	.transition()
	.delay(367)
	.duration(2500)
	.attr({'opacity':0.0,transform:'translate(' + x + ' ' + y + ') scale(0)'})
	.remove();
	
	// .transition()
	// .duration(5)

	// .attr('opacity',0.0);
}

function playContents(path)
{
	console.log(path);
	readFile(path)
	.then((data)=>{
		return new Promise((resolve,reject)=>{
			var ab = toArrayBuffer(data); 
			console.log(ab.byteLength);
			audioCtx.decodeAudioData(ab,(buffer)=>{
				resolve(buffer);
			},(err)=>{reject(new Error('decodeAudioData():error:'));});
		});
	})
	.then((buffer)=>{
		return new Promise((resolve,reject)=>{
			var source = audioCtx.createBufferSource();
			var end = false;
			source.buffer = buffer;
			source.connect(audioCtx.destination);
			source.onended = ()=>
			{
				console.log('end');
				end = true;
				resolve();
			} 
			// アニメーションのスタート
			svg = 
				d3.select('body')
				.append('svg')
				.attr({'width':'1024px','height':'768px'});
			source.start(0);
			var startTime = audioCtx.currentTime - 0.1;
			function animate()
			{
				var currentTime = audioCtx.currentTime - startTime;
				tracks.sequence(currentTime);
				if(!end){
					requestAnimationFrame(animate);
				}
			}
			animate();
		});
	})
	.then(()=>{
	})
	.catch((err)=>{console.log(err);});

	

}
