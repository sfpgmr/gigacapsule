'use strict';

var remote = require('remote');
var app = remote.require('app');
var ipc = require('ipc');

ipc.on('playVideo', function (path) {
  d3.select('body').append('video').attr({ src: path, width: '100%', height: '100%', autoplay: 'autoplay', autobuffer: 'autobuffer' }).on('ended', function () {
    d3.select(this).remove();
    ipc.send('playVideoEnd', path);
  });
});
ipc.on('playAudio', function (path) {
  d3.select('body').append('audio').attr({ src: path, autoplay: 'autoplay', preload: 'auto' }).on('ended', function () {
    d3.select(this).remove();
    ipc.send('playAudioEnd', path);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUUsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEMsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV6QixHQUFHLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBQyxVQUFTLElBQUksRUFBQztBQUMvQixJQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUNkLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FDZixJQUFJLENBQUMsRUFBQyxHQUFHLEVBQUMsSUFBSSxFQUFDLEtBQUssRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLFVBQVUsRUFBQyxZQUFZLEVBQUMsQ0FBQyxDQUN2RixFQUFFLENBQUMsT0FBTyxFQUFDLFlBQVU7QUFDcEIsTUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN6QixPQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBQyxJQUFJLENBQUMsQ0FBQztHQUMvQixDQUFDLENBQUM7Q0FDTixDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBQyxVQUFTLElBQUksRUFBQztBQUMvQixJQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUNkLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FDZixJQUFJLENBQUMsRUFBQyxHQUFHLEVBQUMsSUFBSSxFQUFDLFFBQVEsRUFBQyxVQUFVLEVBQUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxDQUFDLENBQ25ELEVBQUUsQ0FBQyxPQUFPLEVBQUMsWUFBVTtBQUNwQixNQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3pCLE9BQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFDLElBQUksQ0FBQyxDQUFDO0dBQy9CLENBQUMsQ0FBQztDQUNOLENBQUMsQ0FBQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiAgdmFyIHJlbW90ZSA9IHJlcXVpcmUoJ3JlbW90ZScpO1xyXG4gIHZhciBhcHAgPSByZW1vdGUucmVxdWlyZSgnYXBwJyk7XHJcbiAgdmFyIGlwYyA9IHJlcXVpcmUoJ2lwYycpO1xyXG4gIFxyXG4gIGlwYy5vbigncGxheVZpZGVvJyxmdW5jdGlvbihwYXRoKXtcclxuICAgIGQzLnNlbGVjdCgnYm9keScpXHJcbiAgICAgIC5hcHBlbmQoJ3ZpZGVvJylcclxuICAgICAgLmF0dHIoe3NyYzpwYXRoLHdpZHRoOicxMDAlJyxoZWlnaHQ6JzEwMCUnLGF1dG9wbGF5OidhdXRvcGxheScsYXV0b2J1ZmZlcjonYXV0b2J1ZmZlcid9KVxyXG4gICAgICAub24oJ2VuZGVkJyxmdW5jdGlvbigpe1xyXG4gICAgICAgIGQzLnNlbGVjdCh0aGlzKS5yZW1vdmUoKTtcclxuICAgICAgICBpcGMuc2VuZCgncGxheVZpZGVvRW5kJyxwYXRoKTtcclxuICAgICAgfSk7XHJcbiAgfSk7XHJcbiAgaXBjLm9uKCdwbGF5QXVkaW8nLGZ1bmN0aW9uKHBhdGgpe1xyXG4gICAgZDMuc2VsZWN0KCdib2R5JylcclxuICAgICAgLmFwcGVuZCgnYXVkaW8nKVxyXG4gICAgICAuYXR0cih7c3JjOnBhdGgsYXV0b3BsYXk6J2F1dG9wbGF5JyxwcmVsb2FkOidhdXRvJ30pXHJcbiAgICAgIC5vbignZW5kZWQnLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnJlbW92ZSgpO1xyXG4gICAgICAgIGlwYy5zZW5kKCdwbGF5QXVkaW9FbmQnLHBhdGgpO1xyXG4gICAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgLy8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLGZ1bmN0aW9uKCl7XHJcbiAgLy8gICBkMy5zZWxlY3QoJ2JvZHknKVxyXG4gIC8vICAgICAuYXBwZW5kKCd2aWRlbycpXHJcbiAgLy8gICAgIC5hdHRyKHtzcmM6Jy4vZ2lnYWNhcHN1bGUvdGl0bGUuTVA0Jyx3aWR0aDonMTAwJScsaGVpZ2h0OicxMDAlJyxhdXRvcGxheTonYXV0b3BsYXknLGF1dG9idWZmZXI6J2F1dG9idWZmZXInfSlcclxuICAvLyAgICAgLm9uKCdlbmRlZCcsZnVuY3Rpb24oKXtcclxuICAvLyAgICAgICBkMy5zZWxlY3QodGhpcykucmVtb3ZlKCk7XHJcbiAgLy8gICAgICAgZDMuc2VsZWN0KCdib2R5JylcclxuICAvLyAgICAgICAuYXBwZW5kKCd2aWRlbycpXHJcbiAgLy8gICAgICAgLmF0dHIoe3NyYzonLi9naWdhY2Fwc3VsZS9TVEFSVC5NUDQnLHdpZHRoOicxMDAlJyxoZWlnaHQ6JzEwMCUnLGF1dG9wbGF5OidhdXRvcGxheScsYXV0b2J1ZmZlcjonYXV0b2J1ZmZlcid9KVxyXG4gIC8vICAgICAgIC5vbignZW5kZWQnLGZ1bmN0aW9uKCl7XHJcbiAgLy8gICAgICAgICBkMy5zZWxlY3QodGhpcykucmVtb3ZlKCk7XHJcbiAgLy8gICAgICAgfSk7XHJcbiAgLy8gICAgIH0pO1xyXG4gIC8vIH0pO1xyXG4gIFxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
