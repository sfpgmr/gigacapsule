'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ipc = require('ipc');

var _ipc2 = _interopRequireDefault(_ipc);

function player() {
  _ipc2['default'].on('playVideo', function (path, opt) {
    opt = opt || {};
    var elm = d3.select('body').append('video').attr({ src: path, width: '100%', height: '100%', autoplay: 'autoplay', autobuffer: 'autobuffer' }).attr(opt).on('ended', function () {
      d3.select(this).remove();
      _ipc2['default'].send('playVideoEnd', path);
    });
    d3.select(window).on('keydown', function () {
      elm.node().stop;
      elm.remove();
      _ipc2['default'].send('playVideoEnd', path);
    });
  });

  _ipc2['default'].on('playAudio', function (path, opt) {
    opt = opt || {};
    var elm = d3.select('body').append('audio').attr({ src: path, autoplay: 'autoplay', preload: 'auto' }).attr(opt).on('ended', function () {
      d3.select(this).remove();
      _ipc2['default'].send('playAudioEnd', path);
    });
    d3.select(window).on('keydown', function () {
      elm.node().stop;
      elm.remove();
      _ipc2['default'].send('playAudioEnd', path);
    });
  });
}
exports['default'] = player;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJyb3dzZXJQbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7bUJBQWtCLEtBQUs7Ozs7QUFDckIsU0FBUyxNQUFNLEdBQUc7QUFDaEIsbUJBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFVLElBQUksRUFBQyxHQUFHLEVBQUU7QUFDdEMsT0FBRyxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUM7QUFDaEIsUUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FDeEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUNmLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQ2xHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FDVCxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVk7QUFDdkIsUUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN6Qix1QkFBSSxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ2hDLENBQUMsQ0FBQztBQUNMLE1BQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQ2QsRUFBRSxDQUFDLFNBQVMsRUFBRSxZQUFZO0FBQ3pCLFNBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUM7QUFDaEIsU0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2IsdUJBQUksSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNoQyxDQUFDLENBQUM7R0FFTixDQUFDLENBQUM7O0FBRUgsbUJBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFVLElBQUksRUFBQyxHQUFHLEVBQUU7QUFDdEMsT0FBRyxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUM7QUFDaEIsUUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FDeEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUNmLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FDMUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUNULEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBWTtBQUN2QixRQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3pCLHVCQUFJLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDaEMsQ0FBQyxDQUFDO0FBQ0wsTUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FDZCxFQUFFLENBQUMsU0FBUyxFQUFFLFlBQVk7QUFDekIsU0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQztBQUNoQixTQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDYix1QkFBSSxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ2hDLENBQUMsQ0FBQztHQUVOLENBQUMsQ0FBQztDQUVKO3FCQUNjLE1BQU0iLCJmaWxlIjoiYnJvd3NlclBsYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiAgaW1wb3J0IGlwYyBmcm9tICdpcGMnO1xyXG4gIGZ1bmN0aW9uIHBsYXllciAoKXtcclxuICAgIGlwYy5vbigncGxheVZpZGVvJywgZnVuY3Rpb24gKHBhdGgsb3B0KSB7XHJcbiAgICAgIG9wdCA9IG9wdCB8fCB7fTtcclxuICAgICAgdmFyIGVsbSA9IGQzLnNlbGVjdCgnYm9keScpXHJcbiAgICAgICAgLmFwcGVuZCgndmlkZW8nKVxyXG4gICAgICAgIC5hdHRyKHsgc3JjOiBwYXRoLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgYXV0b3BsYXk6ICdhdXRvcGxheScsIGF1dG9idWZmZXI6ICdhdXRvYnVmZmVyJyB9KVxyXG4gICAgICAgIC5hdHRyKG9wdClcclxuICAgICAgICAub24oJ2VuZGVkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgaXBjLnNlbmQoJ3BsYXlWaWRlb0VuZCcsIHBhdGgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICBkMy5zZWxlY3Qod2luZG93KVxyXG4gICAgICAgIC5vbigna2V5ZG93bicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGVsbS5ub2RlKCkuc3RvcDtcclxuICAgICAgICAgIGVsbS5yZW1vdmUoKTtcclxuICAgICAgICAgIGlwYy5zZW5kKCdwbGF5VmlkZW9FbmQnLCBwYXRoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICBpcGMub24oJ3BsYXlBdWRpbycsIGZ1bmN0aW9uIChwYXRoLG9wdCkge1xyXG4gICAgICBvcHQgPSBvcHQgfHwge307XHJcbiAgICAgIHZhciBlbG0gPSBkMy5zZWxlY3QoJ2JvZHknKVxyXG4gICAgICAgIC5hcHBlbmQoJ2F1ZGlvJylcclxuICAgICAgICAuYXR0cih7IHNyYzogcGF0aCwgYXV0b3BsYXk6ICdhdXRvcGxheScsIHByZWxvYWQ6ICdhdXRvJyB9KVxyXG4gICAgICAgIC5hdHRyKG9wdClcclxuICAgICAgICAub24oJ2VuZGVkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgaXBjLnNlbmQoJ3BsYXlBdWRpb0VuZCcsIHBhdGgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICBkMy5zZWxlY3Qod2luZG93KVxyXG4gICAgICAgIC5vbigna2V5ZG93bicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGVsbS5ub2RlKCkuc3RvcDtcclxuICAgICAgICAgIGVsbS5yZW1vdmUoKTtcclxuICAgICAgICAgIGlwYy5zZW5kKCdwbGF5QXVkaW9FbmQnLCBwYXRoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxuICAgIFxyXG4gIH1cclxuICBleHBvcnQgZGVmYXVsdCBwbGF5ZXI7XHJcblxyXG4gIFxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=