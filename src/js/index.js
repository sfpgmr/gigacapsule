  var remote = require('remote');
  var app = remote.require('app');
  var ipc = require('ipc');
  
  ipc.on('playVideo',function(path){
    d3.select('body')
      .append('video')
      .attr({src:path,width:'100%',height:'100%',autoplay:'autoplay',autobuffer:'autobuffer'})
      .on('ended',function(){
        d3.select(this).remove();
        ipc.send('playVideoEnd',path);
      });
  });
  ipc.on('playAudio',function(path){
    d3.select('body')
      .append('audio')
      .attr({src:path,autoplay:'autoplay',preload:'auto'})
      .on('ended',function(){
        d3.select(this).remove();
        ipc.send('playAudioEnd',path);
      });
  });

  // window.addEventListener('load',function(){
  //   d3.select('body')
  //     .append('video')
  //     .attr({src:'./gigacapsule/title.MP4',width:'100%',height:'100%',autoplay:'autoplay',autobuffer:'autobuffer'})
  //     .on('ended',function(){
  //       d3.select(this).remove();
  //       d3.select('body')
  //       .append('video')
  //       .attr({src:'./gigacapsule/START.MP4',width:'100%',height:'100%',autoplay:'autoplay',autobuffer:'autobuffer'})
  //       .on('ended',function(){
  //         d3.select(this).remove();
  //       });
  //     });
  // });
  
