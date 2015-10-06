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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUUsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEMsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV6QixHQUFHLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBQyxVQUFTLElBQUksRUFBQztBQUMvQixJQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUNkLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FDZixJQUFJLENBQUMsRUFBQyxHQUFHLEVBQUMsSUFBSSxFQUFDLEtBQUssRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLFVBQVUsRUFBQyxZQUFZLEVBQUMsQ0FBQyxDQUN2RixFQUFFLENBQUMsT0FBTyxFQUFDLFlBQVU7QUFDcEIsTUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN6QixPQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBQyxJQUFJLENBQUMsQ0FBQztHQUMvQixDQUFDLENBQUM7Q0FDTixDQUFDLENBQUM7O0FBRUgsR0FBRyxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUMsVUFBUyxJQUFJLEVBQUM7QUFDL0IsSUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FDZCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQ2YsSUFBSSxDQUFDLEVBQUMsR0FBRyxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLE9BQU8sRUFBQyxNQUFNLEVBQUMsQ0FBQyxDQUNuRCxFQUFFLENBQUMsT0FBTyxFQUFDLFlBQVU7QUFDcEIsTUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN6QixPQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBQyxJQUFJLENBQUMsQ0FBQztHQUMvQixDQUFDLENBQUM7Q0FDTixDQUFDLENBQUMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgIHZhciByZW1vdGUgPSByZXF1aXJlKCdyZW1vdGUnKTtcclxuICB2YXIgYXBwID0gcmVtb3RlLnJlcXVpcmUoJ2FwcCcpO1xyXG4gIHZhciBpcGMgPSByZXF1aXJlKCdpcGMnKTtcclxuICBcclxuICBpcGMub24oJ3BsYXlWaWRlbycsZnVuY3Rpb24ocGF0aCl7XHJcbiAgICBkMy5zZWxlY3QoJ2JvZHknKVxyXG4gICAgICAuYXBwZW5kKCd2aWRlbycpXHJcbiAgICAgIC5hdHRyKHtzcmM6cGF0aCx3aWR0aDonMTAwJScsaGVpZ2h0OicxMDAlJyxhdXRvcGxheTonYXV0b3BsYXknLGF1dG9idWZmZXI6J2F1dG9idWZmZXInfSlcclxuICAgICAgLm9uKCdlbmRlZCcsZnVuY3Rpb24oKXtcclxuICAgICAgICBkMy5zZWxlY3QodGhpcykucmVtb3ZlKCk7XHJcbiAgICAgICAgaXBjLnNlbmQoJ3BsYXlWaWRlb0VuZCcscGF0aCk7XHJcbiAgICAgIH0pO1xyXG4gIH0pO1xyXG4gIFxyXG4gIGlwYy5vbigncGxheUF1ZGlvJyxmdW5jdGlvbihwYXRoKXtcclxuICAgIGQzLnNlbGVjdCgnYm9keScpXHJcbiAgICAgIC5hcHBlbmQoJ2F1ZGlvJylcclxuICAgICAgLmF0dHIoe3NyYzpwYXRoLGF1dG9wbGF5OidhdXRvcGxheScscHJlbG9hZDonYXV0byd9KVxyXG4gICAgICAub24oJ2VuZGVkJyxmdW5jdGlvbigpe1xyXG4gICAgICAgIGQzLnNlbGVjdCh0aGlzKS5yZW1vdmUoKTtcclxuICAgICAgICBpcGMuc2VuZCgncGxheUF1ZGlvRW5kJyxwYXRoKTtcclxuICAgICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJyxmdW5jdGlvbigpe1xyXG4gIC8vICAgZDMuc2VsZWN0KCdib2R5JylcclxuICAvLyAgICAgLmFwcGVuZCgndmlkZW8nKVxyXG4gIC8vICAgICAuYXR0cih7c3JjOicuL2dpZ2FjYXBzdWxlL3RpdGxlLk1QNCcsd2lkdGg6JzEwMCUnLGhlaWdodDonMTAwJScsYXV0b3BsYXk6J2F1dG9wbGF5JyxhdXRvYnVmZmVyOidhdXRvYnVmZmVyJ30pXHJcbiAgLy8gICAgIC5vbignZW5kZWQnLGZ1bmN0aW9uKCl7XHJcbiAgLy8gICAgICAgZDMuc2VsZWN0KHRoaXMpLnJlbW92ZSgpO1xyXG4gIC8vICAgICAgIGQzLnNlbGVjdCgnYm9keScpXHJcbiAgLy8gICAgICAgLmFwcGVuZCgndmlkZW8nKVxyXG4gIC8vICAgICAgIC5hdHRyKHtzcmM6Jy4vZ2lnYWNhcHN1bGUvU1RBUlQuTVA0Jyx3aWR0aDonMTAwJScsaGVpZ2h0OicxMDAlJyxhdXRvcGxheTonYXV0b3BsYXknLGF1dG9idWZmZXI6J2F1dG9idWZmZXInfSlcclxuICAvLyAgICAgICAub24oJ2VuZGVkJyxmdW5jdGlvbigpe1xyXG4gIC8vICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnJlbW92ZSgpO1xyXG4gIC8vICAgICAgIH0pO1xyXG4gIC8vICAgICB9KTtcclxuICAvLyB9KTtcclxuICBcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
