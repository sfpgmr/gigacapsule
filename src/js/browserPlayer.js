  import ipc from 'ipc';
  function player (){
    ipc.on('playVideo', function (path,opt) {
      opt = opt || {};
      var elm = d3.select('body')
        .append('video')
        .attr({ src: path, width: '100%', height: '100%', autoplay: 'autoplay', autobuffer: 'autobuffer' })
        .attr(opt)
        .on('ended', function () {
          d3.select(this).remove();
          ipc.send('playVideoEnd', path);
        });
      d3.select(window)
        .on('keydown', function () {
          elm.node().stop;
          elm.remove();
          ipc.send('playVideoEnd', path);
        });

    });

    ipc.on('playAudio', function (path,opt) {
      opt = opt || {};
      var elm = d3.select('body')
        .append('audio')
        .attr({ src: path, autoplay: 'autoplay', preload: 'auto' })
        .attr(opt)
        .on('ended', function () {
          d3.select(this).remove();
          ipc.send('playAudioEnd', path);
        });
      d3.select(window)
        .on('keydown', function () {
          elm.node().stop;
          elm.remove();
          ipc.send('playAudioEnd', path);
        });

    });
    
  }
  export default player;

  
