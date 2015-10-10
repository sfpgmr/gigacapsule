'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _app = require('app');

var _app2 = _interopRequireDefault(_app);

var _denodeify = require('./denodeify');

var _denodeify2 = _interopRequireDefault(_denodeify);

var _browserWindow = require('browser-window');

var _browserWindow2 = _interopRequireDefault(_browserWindow);

var _ipc = require('ipc');

var _ipc2 = _interopRequireDefault(_ipc);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _makedir = require('./makedir');

var _makedir2 = _interopRequireDefault(_makedir);

var _child_process = require('child_process');

var _crashReporter = require('crash-reporter');

var _crashReporter2 = _interopRequireDefault(_crashReporter);

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

var access = (0, _denodeify2['default'])(fs.access);
var exec = (0, _denodeify2['default'])(_child_process.exec);
var playPromises = Promise.resolve(0);
var cachePromises = Promise.resolve(0);
var cacheRoot = path.join(_app2['default'].getPath('cache'), 'sfpgmr');
var cachePath = path.join(cacheRoot, 'gigacapsule');
var workPath = path.join(cachePath, 'work');
var gigaCapsule = '';
var player;

_ipc2['default'].setMaxListeners(0);
_crashReporter2['default'].start();

var mainWindow = null;

_app2['default'].on('window-all-closed', function () {
  if (process.platform != 'darwin') _app2['default'].quit();
});

_app2['default'].on('ready', function () {
  // Giga Capsule ディスクをチェックする
  // Windows のみ...
  exec('wmic logicaldisk get caption').then(function (stdout, stderr) {
    return new Promise(function (resolve, reject) {
      stdout.split(/\r\r\n/).forEach(function (d) {
        if (d.match(/\:/)) {
          var drive = d.trim();
          if (fs.existsSync(drive + '/YMOGIGA.EXE')) {
            resolve(drive);
          }
        }
      });
      reject('Giga Capsule Disk Not Found.');
    });
  }).then(function (drive) {
    // Giga Capsuleのドライブ判明
    gigaCapsule = path.join(drive, '/');
    console.log(gigaCapsule);
    // キャッシュディレクトリ作成
    return Promise.resolve();
  }).then((0, _makedir2['default'])(cacheRoot)).then((0, _makedir2['default'])(cachePath)).then((0, _makedir2['default'])(workPath)).then(function () {
    // プレイヤー
    player = new _player2['default'](gigaCapsule, cachePath, workPath);

    return new Promise(function (resolve, reject) {
      // ブラウザ(Chromium)の起動, 初期画面のロード
      mainWindow = new _browserWindow2['default']({
        'width': 1024,
        'height': 768,
        'use-content-size': true,
        'center': true,
        'auto-hide-menu-bar': true,
        'title': 'YMO Giga Capusle Viewer',
        'web-preferences': {
          'direct-write': true,
          'webgl': true,
          'webaudio': true
        }
      });
      mainWindow.loadUrl('file://' + __dirname + '/../index.html');
      mainWindow.on('closed', function () {
        mainWindow = null;
      });
      mainWindow.webContents.on('did-finish-load', function () {
        resolve();
      });
    });
  })
  // オープニングコンテンツの再生
  .then(function () {
    [
      // '/MOVIE/QT/TITLE.MOV',
      // '/MOVIE/QT/START.MOV'
    ].forEach(function (p) {
      player.play(mainWindow, p);
    });
    //player.playEnd();
    return Promise.all([player.prepareCache('/MOVIE/SOUND/OPENING.AIF', '.ogg', '-a:b 256k'), player.playPromises]);
  }).then(function (args) {
    return player.wait().then(function () {
      return args[0];
    });
  }).then(function (path_) {
    console.log('play end.');
    player.clear();
    return new Promise(function (resolve, reject) {
      mainWindow.loadUrl('file://' + __dirname + '/../html/jingle.html');
      mainWindow.webContents.on('did-finish-load', function () {
        resolve(path_);
      });
    });
  }).then(function (path_) {
    console.log('loaded.');
    mainWindow.webContents.send('play', path_);
  })['catch'](function (e) {
    var dialog = require('dialog');
    dialog.showErrorBox('Error', e);
    if (process.platform != 'darwin') _app2['default'].quit();
    //    console.log(e);
  });
  //app.quit();
});
//# sourceMappingURL=data:application/json;base64,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Q0FBQyxDQUFDLENBQUM7S0FBQSxDQUFDLENBQUM7R0FDeEMsQ0FBQyxDQUNELElBQUksQ0FBQyxVQUFDLEtBQUssRUFBRztBQUNiLFdBQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDekIsVUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2YsV0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFDLE9BQU8sRUFBQyxNQUFNLEVBQUc7QUFDcEMsZ0JBQVUsQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVMsR0FBRyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ25FLGdCQUFVLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxZQUFXO0FBQ3RELGVBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUNoQixDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSixDQUFDLENBQ0QsSUFBSSxDQUFDLFVBQUMsS0FBSyxFQUFHO0FBQ2IsV0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN2QixjQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUMsS0FBSyxDQUFDLENBQUM7R0FDM0MsQ0FBQyxTQUNJLENBQUMsVUFBQyxDQUFDLEVBQUc7QUFDVixRQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsVUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBSSxPQUFPLENBQUMsUUFBUSxJQUFJLFFBQVEsRUFDOUIsaUJBQUksSUFBSSxFQUFFLENBQUM7O0dBRWQsQ0FBQyxDQUFDOztDQUVKLENBQUMsQ0FBQyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IGFwcCBmcm9tICdhcHAnO1xyXG5pbXBvcnQgZGVub2RlaWZ5IGZyb20gJy4vZGVub2RlaWZ5JztcclxuaW1wb3J0IEJyb3dzZXJXaW5kb3cgZnJvbSAnYnJvd3Nlci13aW5kb3cnO1xyXG5pbXBvcnQgaXBjIGZyb20gJ2lwYyc7XHJcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcclxuaW1wb3J0ICogYXMgcGF0aCAgZnJvbSAncGF0aCc7XHJcbmltcG9ydCBtYWtlZGlyIGZyb20gJy4vbWFrZWRpcic7XHJcbmltcG9ydCB7IGV4ZWMgIGFzIGV4ZWNfIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XHJcbmltcG9ydCBjcmFzaFJlcG9ydGVyICBmcm9tICdjcmFzaC1yZXBvcnRlcic7XHJcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi9wbGF5ZXInO1xyXG5cclxudmFyIGFjY2VzcyA9IGRlbm9kZWlmeShmcy5hY2Nlc3MpO1xyXG52YXIgZXhlYyA9IGRlbm9kZWlmeShleGVjXyk7XHJcbnZhciBwbGF5UHJvbWlzZXMgPSBQcm9taXNlLnJlc29sdmUoMCk7XHJcbnZhciBjYWNoZVByb21pc2VzID0gUHJvbWlzZS5yZXNvbHZlKDApO1xyXG52YXIgY2FjaGVSb290ID0gcGF0aC5qb2luKGFwcC5nZXRQYXRoKCdjYWNoZScpLCdzZnBnbXInKTtcclxudmFyIGNhY2hlUGF0aCA9IHBhdGguam9pbihjYWNoZVJvb3QsJ2dpZ2FjYXBzdWxlJyk7XHJcbnZhciB3b3JrUGF0aCA9IHBhdGguam9pbihjYWNoZVBhdGgsJ3dvcmsnKTtcclxudmFyIGdpZ2FDYXBzdWxlID0gJyc7XHJcbnZhciBwbGF5ZXI7XHJcblxyXG5pcGMuc2V0TWF4TGlzdGVuZXJzKDApO1xyXG5jcmFzaFJlcG9ydGVyLnN0YXJ0KCk7XHJcblxyXG52YXIgbWFpbldpbmRvdyA9IG51bGw7XHJcblxyXG5hcHAub24oJ3dpbmRvdy1hbGwtY2xvc2VkJywgZnVuY3Rpb24oKSB7XHJcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT0gJ2RhcndpbicpXHJcbiAgICBhcHAucXVpdCgpO1xyXG59KTtcclxuXHJcblxyXG5hcHAub24oJ3JlYWR5JywgZnVuY3Rpb24oKSB7XHJcbiAgLy8gR2lnYSBDYXBzdWxlIOODh+OCo+OCueOCr+OCkuODgeOCp+ODg+OCr+OBmeOCi1xyXG4gIC8vIFdpbmRvd3Mg44Gu44G/Li4uXHJcbiAgZXhlYygnd21pYyBsb2dpY2FsZGlzayBnZXQgY2FwdGlvbicpXHJcbiAgLnRoZW4oKHN0ZG91dCxzdGRlcnIpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSxyZWplY3QpID0+IHtcclxuICAgICAgICBzdGRvdXQuc3BsaXQoL1xcclxcclxcbi8pLmZvckVhY2goKGQpPT57XHJcbiAgICAgICAgICBpZihkLm1hdGNoKC9cXDovKSl7XHJcbiAgICAgICAgICAgIGxldCBkcml2ZSA9IGQudHJpbSgpO1xyXG4gICAgICAgICAgICBpZihmcy5leGlzdHNTeW5jKGRyaXZlICsgJy9ZTU9HSUdBLkVYRScpKXtcclxuICAgICAgICAgICAgICByZXNvbHZlKGRyaXZlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJlamVjdCgnR2lnYSBDYXBzdWxlIERpc2sgTm90IEZvdW5kLicpO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuICAudGhlbigoZHJpdmUpPT57XHJcbiAgICAvLyBHaWdhIENhcHN1bGXjga7jg4njg6njgqTjg5bliKTmmI5cclxuICAgIGdpZ2FDYXBzdWxlID0gcGF0aC5qb2luKGRyaXZlLCcvJyk7XHJcbiAgICBjb25zb2xlLmxvZyhnaWdhQ2Fwc3VsZSk7XHJcbiAgICAvLyDjgq3jg6Pjg4Pjgrfjg6Xjg4fjgqPjg6zjgq/jg4jjg6rkvZzmiJBcclxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICB9KVxyXG4gIC50aGVuKG1ha2VkaXIoY2FjaGVSb290KSlcclxuICAudGhlbihtYWtlZGlyKGNhY2hlUGF0aCkpXHJcbiAgLnRoZW4obWFrZWRpcih3b3JrUGF0aCkpXHJcbiAgLnRoZW4oKCkgPT4ge1xyXG4gICAgLy8g44OX44Os44Kk44Ok44O8XHJcbiAgICBwbGF5ZXIgPSBuZXcgUGxheWVyKGdpZ2FDYXBzdWxlLGNhY2hlUGF0aCx3b3JrUGF0aCk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KXtcclxuICAgIC8vIOODluODqeOCpuOCtihDaHJvbWl1bSnjga7otbfli5UsIOWIneacn+eUu+mdouOBruODreODvOODiVxyXG4gICAgICBtYWluV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgJ3dpZHRoJzogMTAyNCxcclxuICAgICAgICAgICdoZWlnaHQnOiA3NjgsXHJcbiAgICAgICAgICAndXNlLWNvbnRlbnQtc2l6ZSc6dHJ1ZSxcclxuICAgICAgICAgICdjZW50ZXInOnRydWUsXHJcbiAgICAgICAgICAnYXV0by1oaWRlLW1lbnUtYmFyJzogdHJ1ZSxcclxuICAgICAgICAgICd0aXRsZSc6J1lNTyBHaWdhIENhcHVzbGUgVmlld2VyJyxcclxuICAgICAgICAgICd3ZWItcHJlZmVyZW5jZXMnOntcclxuICAgICAgICAgICAgJ2RpcmVjdC13cml0ZSc6IHRydWUsXHJcbiAgICAgICAgICAgICd3ZWJnbCc6dHJ1ZSxcclxuICAgICAgICAgICAgJ3dlYmF1ZGlvJzp0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgICBtYWluV2luZG93LmxvYWRVcmwoJ2ZpbGU6Ly8nICsgX19kaXJuYW1lICsgJy8uLi9pbmRleC5odG1sJyk7XHJcbiAgICAgIG1haW5XaW5kb3cub24oJ2Nsb3NlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIG1haW5XaW5kb3cgPSBudWxsO1xyXG4gICAgICB9KTtcclxuICAgICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vbignZGlkLWZpbmlzaC1sb2FkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9KTsgICAgXHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC8vIOOCquODvOODl+ODi+ODs+OCsOOCs+ODs+ODhuODs+ODhOOBruWGjeeUn1xyXG4gIC50aGVuKCgpPT57XHJcbiAgICBbXHJcbiAgICAgIC8vICcvTU9WSUUvUVQvVElUTEUuTU9WJyxcclxuICAgICAgLy8gJy9NT1ZJRS9RVC9TVEFSVC5NT1YnXHJcbiAgICBdLmZvckVhY2goKHApID0+IHtcclxuICAgICAgcGxheWVyLnBsYXkobWFpbldpbmRvdyxwKTtcclxuICAgIH0pO1xyXG4gICAgLy9wbGF5ZXIucGxheUVuZCgpO1xyXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFtwbGF5ZXIucHJlcGFyZUNhY2hlKCcvTU9WSUUvU09VTkQvT1BFTklORy5BSUYnLCcub2dnJywnLWE6YiAyNTZrJykscGxheWVyLnBsYXlQcm9taXNlc10pO1xyXG4gIH0pLnRoZW4oKGFyZ3MpPT57XHJcbiAgICByZXR1cm4gcGxheWVyLndhaXQoKS50aGVuKCgpPT5hcmdzWzBdKTtcclxuICB9KVxyXG4gIC50aGVuKChwYXRoXyk9PntcclxuICAgIGNvbnNvbGUubG9nKCdwbGF5IGVuZC4nKTtcclxuICAgIHBsYXllci5jbGVhcigpO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlICgocmVzb2x2ZSxyZWplY3QpPT57XHJcbiAgICAgIG1haW5XaW5kb3cubG9hZFVybCgnZmlsZTovLycgKyBfX2Rpcm5hbWUgKyAnLy4uL2h0bWwvamluZ2xlLmh0bWwnKTtcclxuICAgICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vbignZGlkLWZpbmlzaC1sb2FkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmVzb2x2ZShwYXRoXyk7XHJcbiAgICAgIH0pOyAgICBcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLnRoZW4oKHBhdGhfKT0+e1xyXG4gICAgY29uc29sZS5sb2coJ2xvYWRlZC4nKTtcclxuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgncGxheScscGF0aF8pO1xyXG4gIH0pXHJcbiAgLmNhdGNoKChlKT0+e1xyXG4gICAgdmFyIGRpYWxvZyA9IHJlcXVpcmUoJ2RpYWxvZycpO1xyXG4gICAgZGlhbG9nLnNob3dFcnJvckJveCgnRXJyb3InLGUpO1xyXG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT0gJ2RhcndpbicpXHJcbiAgICAgIGFwcC5xdWl0KCk7XHJcbi8vICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gIH0pO1xyXG4gIC8vYXBwLnF1aXQoKTtcclxufSk7XHJcblxyXG5cclxuXHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
