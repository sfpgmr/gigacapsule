  var remote = require('remote');
  var app = remote.require('app');
  

  window.addEventListener('load',function(){
    d3.select('body')
      .append('video')
      .attr({src:'../gigacapsule/title.MP4',width:'100%',height:'100%',autoplay:'autoplay',autobuffer:'autobuffer'})
      .on('ended',function(){
        d3.select(this).remove();
        d3.select('body')
        .append('video')
        .attr({src:'../gigacapsule/START.MP4',width:'100%',height:'100%',autoplay:'autoplay',autobuffer:'autobuffer'})
        .on('ended',function(){
          d3.select(this).remove();
        });
      });
  });
  
