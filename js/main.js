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
    ['/MOVIE/QT/TITLE.MOV', '/MOVIE/QT/START.MOV'].forEach(function (p) {
      player.play(mainWindow, p);
    });
    //player.playEnd();
    return Promise.all([player.prepareCache('/MOVIE/SOUND/OPENING.AIF', '.ogg', ''), player.playPromises]);
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
    return Promise.all([new Promise(function (resolve, reject) {
      console.log('loaded.');
      mainWindow.webContents.send('play', path_);
      _ipc2['default'].on('end', function () {
        resolve();
      });
    }), player.prepareCache('/MOVIE/SOUND/BG.AIF'), player.prepareCache('/MOVIE/SOUND/03_02.AIF'), player.prepareCache('/MOVIE/SOUND/19_02.AIF')]);
  }).then(function (args) {
    console.log('Jingle Y.M.O. played.');
    mainWindow.loadUrl('file://' + __dirname + '/../html/menu.html');
    mainWindow.webContents.on('did-finish-load', function () {
      mainWindow.webContents.send('audioResource', args.slice(2));
      mainWindow.webContents.send('playAudio', args[1], { loop: true });
    });

    _ipc2['default'].on('click', function (e, arg) {
      console.log(arg);
      switch (arg) {
        case 'Remix':
          mainWindow.loadUrl('file://' + __dirname + '/../html/remix.html');
          mainWindow.webContents.on('did-finish-load', function () {
            initCacheForRemix().then(function (resources) {
              mainWindow.webContents.send('resources', resources);
            });
          });
          break;
        case 'Interview':
          break;
        case 'Sample':
          break;
        case 'Tracks':
          break;
        case 'RareVideos':
          break;
        case 'RareTracks':
          break;
        case 'Exit':
          _app2['default'].quit();
          break;
        case 'Menu':
          mainWindow.loadUrl('file://' + __dirname + '/../html/menu.html');
          mainWindow.webContents.on('did-finish-load', function () {
            mainWindow.webContents.send('audioResource', args.slice(2));
            mainWindow.webContents.send('playAudio', args[1], { loop: true });
          });
          break;
      }
    });
  })['catch'](function (e) {
    var dialog = require('dialog');
    dialog.showErrorBox('Error', e);
    if (process.platform != 'darwin') _app2['default'].quit();
    //    console.log(e);
  });
  //app.quit();
});

function initCacheForRemix() {
  var resources = [{ songname: 'Behind The Mask', path: '/MOVIE/L2/REMIX/BEHINDS/BACKING.AIF' }, { songname: 'Behind The Mask', path: '/MOVIE/L2/REMIX/BEHINDS/BASS.AIF' }, { songname: 'Behind The Mask', path: '/MOVIE/L2/REMIX/BEHINDS/DRUMS.AIF' }, { songname: 'Behind The Mask', path: '/MOVIE/L2/REMIX/BEHINDS/E_DRUM.AIF' }, { songname: 'Behind The Mask', path: '/MOVIE/L2/REMIX/BEHINDS/MELO_1.AIF' }, { songname: 'Behind The Mask', path: '/MOVIE/L2/REMIX/BEHINDS/MELO_2.AIF' }, { songname: 'Behind The Mask', path: '/MOVIE/L2/REMIX/BEHINDS/VOCODER.AIF' }, { songname: 'Rydeen', path: '/MOVIE/L2/REMIX/RYDEENS/BASS.AIF' }, { songname: 'Rydeen', path: '/MOVIE/L2/REMIX/RYDEENS/CHORD_LR.AIF' }, { songname: 'Rydeen', path: '/MOVIE/L2/REMIX/RYDEENS/DRUMS.AIF' }, { songname: 'Rydeen', path: '/MOVIE/L2/REMIX/RYDEENS/MELO_1LR.AIF' }, { songname: 'Rydeen', path: '/MOVIE/L2/REMIX/RYDEENS/MELO_2.AIF' }, { songname: 'Rydeen', path: '/MOVIE/L2/REMIX/RYDEENS/PERC_LR.AIF' }, { songname: 'Rydeen', path: '/MOVIE/L2/REMIX/RYDEENS/SEQ.AIF' }, { songname: 'Solid State Survivor', path: '/MOVIE/L2/REMIX/SOLIDS/BASS_LR.AIF' }, { songname: 'Solid State Survivor', path: '/MOVIE/L2/REMIX/SOLIDS/DRUMS.AIF' }, { songname: 'Solid State Survivor', path: '/MOVIE/L2/REMIX/SOLIDS/MELO.AIF' }, { songname: 'Solid State Survivor', path: '/MOVIE/L2/REMIX/SOLIDS/PERC_LR.AIF' }, { songname: 'Solid State Survivor', path: '/MOVIE/L2/REMIX/SOLIDS/SE.AIF' }, { songname: 'Solid State Survivor', path: '/MOVIE/L2/REMIX/SOLIDS/SYNGT_LR.AIF' }, { songname: 'Solid State Survivor', path: '/MOVIE/L2/REMIX/SOLIDS/VOCAL.AIF' }, { songname: 'Technopolis', path: '/MOVIE/L2/REMIX/TECHNOS/BASS.AIF' }, { songname: 'Technopolis', path: '/MOVIE/L2/REMIX/TECHNOS/CHORD_LR.AIF' }, { songname: 'Technopolis', path: '/MOVIE/L2/REMIX/TECHNOS/DRUMS.AIF' }, { songname: 'Technopolis', path: '/MOVIE/L2/REMIX/TECHNOS/ETC.AIF' }, { songname: 'Technopolis', path: '/MOVIE/L2/REMIX/TECHNOS/MELO_LR.AIF' }, { songname: 'Technopolis', path: '/MOVIE/L2/REMIX/TECHNOS/TOBI_LR.AIF' }, { songname: 'Technopolis', path: '/MOVIE/L2/REMIX/TECHNOS/VOCODER.AIF' }, { songname: 'Tong Poo', path: '/MOVIE/L2/REMIX/TONGS/BASS.AIF' }, { songname: 'Tong Poo', path: '/MOVIE/L2/REMIX/TONGS/CHORD_LR.AIF' }, { songname: 'Tong Poo', path: '/MOVIE/L2/REMIX/TONGS/DRUM.AIF' }, { songname: 'Tong Poo', path: '/MOVIE/L2/REMIX/TONGS/E_DRUMS.AIF' }, { songname: 'Tong Poo', path: '/MOVIE/L2/REMIX/TONGS/MELO.AIF' }, { songname: 'Tong Poo', path: '/MOVIE/L2/REMIX/TONGS/OBURI_LR.AIF' }, { songname: 'Tong Poo', path: '/MOVIE/L2/REMIX/TONGS/VOCAL.AIF' }];
  var promise = Promise.resolve();
  var res = [];
  var len = resources.length;
  var idx = 0;

  while (idx < len) {
    var rf = [];
    for (var i = 0; i < 10 && idx < len; ++i) {
      var r = resources[idx];
      rf.push(r);
      ++idx;
    }
    promise = promise.then((function (rf) {
      return function () {
        var arr = [];
        rf.forEach(function (r) {
          arr.push(player.prepareCache(r.path, '.ogg').then(function (cachePath) {
            console.log(cachePath);
            res.push({ songname: r.songname, path: cachePath });
          }));
        });
        return Promise.all(arr);
      };
    })(rf));
  }
  return promise.then(function () {
    return res;
  });
}
//# sourceMappingURL=data:application/json;base64,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dXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBhcHAgZnJvbSAnYXBwJztcclxuaW1wb3J0IGRlbm9kZWlmeSBmcm9tICcuL2Rlbm9kZWlmeSc7XHJcbmltcG9ydCBCcm93c2VyV2luZG93IGZyb20gJ2Jyb3dzZXItd2luZG93JztcclxuaW1wb3J0IGlwYyBmcm9tICdpcGMnO1xyXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCAqIGFzIHBhdGggIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgbWFrZWRpciBmcm9tICcuL21ha2VkaXInO1xyXG5pbXBvcnQgeyBleGVjICBhcyBleGVjXyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xyXG5pbXBvcnQgY3Jhc2hSZXBvcnRlciAgZnJvbSAnY3Jhc2gtcmVwb3J0ZXInO1xyXG5pbXBvcnQgUGxheWVyIGZyb20gJy4vcGxheWVyJztcclxuXHJcbnZhciBhY2Nlc3MgPSBkZW5vZGVpZnkoZnMuYWNjZXNzKTtcclxudmFyIGV4ZWMgPSBkZW5vZGVpZnkoZXhlY18pO1xyXG52YXIgcGxheVByb21pc2VzID0gUHJvbWlzZS5yZXNvbHZlKDApO1xyXG52YXIgY2FjaGVQcm9taXNlcyA9IFByb21pc2UucmVzb2x2ZSgwKTtcclxudmFyIGNhY2hlUm9vdCA9IHBhdGguam9pbihhcHAuZ2V0UGF0aCgnY2FjaGUnKSwnc2ZwZ21yJyk7XHJcbnZhciBjYWNoZVBhdGggPSBwYXRoLmpvaW4oY2FjaGVSb290LCdnaWdhY2Fwc3VsZScpO1xyXG52YXIgd29ya1BhdGggPSBwYXRoLmpvaW4oY2FjaGVQYXRoLCd3b3JrJyk7XHJcbnZhciBnaWdhQ2Fwc3VsZSA9ICcnO1xyXG52YXIgcGxheWVyO1xyXG5cclxuaXBjLnNldE1heExpc3RlbmVycygwKTtcclxuY3Jhc2hSZXBvcnRlci5zdGFydCgpO1xyXG5cclxudmFyIG1haW5XaW5kb3cgPSBudWxsO1xyXG5cclxuYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsIGZ1bmN0aW9uKCkge1xyXG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9ICdkYXJ3aW4nKVxyXG4gICAgYXBwLnF1aXQoKTtcclxufSk7XHJcblxyXG5cclxuYXBwLm9uKCdyZWFkeScsIGZ1bmN0aW9uKCkge1xyXG4gIC8vIEdpZ2EgQ2Fwc3VsZSDjg4fjgqPjgrnjgq/jgpLjg4Hjgqfjg4Pjgq/jgZnjgotcclxuICAvLyBXaW5kb3dzIOOBruOBvy4uLlxyXG4gIGV4ZWMoJ3dtaWMgbG9naWNhbGRpc2sgZ2V0IGNhcHRpb24nKVxyXG4gIC50aGVuKChzdGRvdXQsc3RkZXJyKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUscmVqZWN0KSA9PiB7XHJcbiAgICAgICAgc3Rkb3V0LnNwbGl0KC9cXHJcXHJcXG4vKS5mb3JFYWNoKChkKT0+e1xyXG4gICAgICAgICAgaWYoZC5tYXRjaCgvXFw6Lykpe1xyXG4gICAgICAgICAgICBsZXQgZHJpdmUgPSBkLnRyaW0oKTtcclxuICAgICAgICAgICAgaWYoZnMuZXhpc3RzU3luYyhkcml2ZSArICcvWU1PR0lHQS5FWEUnKSl7XHJcbiAgICAgICAgICAgICAgcmVzb2x2ZShkcml2ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZWplY3QoJ0dpZ2EgQ2Fwc3VsZSBEaXNrIE5vdCBGb3VuZC4nKTtcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLnRoZW4oKGRyaXZlKT0+e1xyXG4gICAgLy8gR2lnYSBDYXBzdWxl44Gu44OJ44Op44Kk44OW5Yik5piOXHJcbiAgICBnaWdhQ2Fwc3VsZSA9IHBhdGguam9pbihkcml2ZSwnLycpO1xyXG4gICAgY29uc29sZS5sb2coZ2lnYUNhcHN1bGUpO1xyXG4gICAgLy8g44Kt44Oj44OD44K344Ol44OH44Kj44Os44Kv44OI44Oq5L2c5oiQXHJcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgfSlcclxuICAudGhlbihtYWtlZGlyKGNhY2hlUm9vdCkpXHJcbiAgLnRoZW4obWFrZWRpcihjYWNoZVBhdGgpKVxyXG4gIC50aGVuKG1ha2VkaXIod29ya1BhdGgpKVxyXG4gIC50aGVuKCgpID0+IHtcclxuICAgIC8vIOODl+ODrOOCpOODpOODvFxyXG4gICAgcGxheWVyID0gbmV3IFBsYXllcihnaWdhQ2Fwc3VsZSxjYWNoZVBhdGgsd29ya1BhdGgpO1xyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCl7XHJcbiAgICAvLyDjg5bjg6njgqbjgrYoQ2hyb21pdW0p44Gu6LW35YuVLCDliJ3mnJ/nlLvpnaLjga7jg63jg7zjg4lcclxuICAgICAgbWFpbldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICd3aWR0aCc6IDEwMjQsXHJcbiAgICAgICAgICAnaGVpZ2h0JzogNzY4LFxyXG4gICAgICAgICAgJ3VzZS1jb250ZW50LXNpemUnOnRydWUsXHJcbiAgICAgICAgICAnY2VudGVyJzp0cnVlLFxyXG4gICAgICAgICAgJ2F1dG8taGlkZS1tZW51LWJhcic6IHRydWUsXHJcbiAgICAgICAgICAndGl0bGUnOidZTU8gR2lnYSBDYXB1c2xlIFZpZXdlcicsXHJcbiAgICAgICAgICAnd2ViLXByZWZlcmVuY2VzJzp7XHJcbiAgICAgICAgICAgICdkaXJlY3Qtd3JpdGUnOiB0cnVlLFxyXG4gICAgICAgICAgICAnd2ViZ2wnOnRydWUsXHJcbiAgICAgICAgICAgICd3ZWJhdWRpbyc6dHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgICAgbWFpbldpbmRvdy5sb2FkVXJsKCdmaWxlOi8vJyArIF9fZGlybmFtZSArICcvLi4vaW5kZXguaHRtbCcpO1xyXG4gICAgICBtYWluV2luZG93Lm9uKCdjbG9zZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBtYWluV2luZG93ID0gbnVsbDtcclxuICAgICAgfSk7XHJcbiAgICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMub24oJ2RpZC1maW5pc2gtbG9hZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfSk7ICAgIFxyXG4gICAgfSk7XHJcbiAgfSlcclxuICAvLyDjgqrjg7zjg5fjg4vjg7PjgrDjgrPjg7Pjg4bjg7Pjg4Tjga7lho3nlJ9cclxuICAudGhlbigoKT0+e1xyXG4gICAgW1xyXG4gICAgICAnL01PVklFL1FUL1RJVExFLk1PVicsXHJcbiAgICAgICcvTU9WSUUvUVQvU1RBUlQuTU9WJ1xyXG4gICAgXS5mb3JFYWNoKChwKSA9PiB7XHJcbiAgICAgIHBsYXllci5wbGF5KG1haW5XaW5kb3cscCk7XHJcbiAgICB9KTtcclxuICAgIC8vcGxheWVyLnBsYXlFbmQoKTtcclxuICAgIHJldHVybiBQcm9taXNlLmFsbChbcGxheWVyLnByZXBhcmVDYWNoZSgnL01PVklFL1NPVU5EL09QRU5JTkcuQUlGJywnLm9nZycsJycpLHBsYXllci5wbGF5UHJvbWlzZXNdKTtcclxuICB9KS50aGVuKChhcmdzKT0+e1xyXG4gICAgcmV0dXJuIHBsYXllci53YWl0KCkudGhlbigoKT0+YXJnc1swXSk7XHJcbiAgfSlcclxuICAudGhlbigocGF0aF8pPT57XHJcbiAgICBjb25zb2xlLmxvZygncGxheSBlbmQuJyk7XHJcbiAgICBwbGF5ZXIuY2xlYXIoKTtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSAoKHJlc29sdmUscmVqZWN0KT0+e1xyXG4gICAgICBtYWluV2luZG93LmxvYWRVcmwoJ2ZpbGU6Ly8nICsgX19kaXJuYW1lICsgJy8uLi9odG1sL2ppbmdsZS5odG1sJyk7XHJcbiAgICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMub24oJ2RpZC1maW5pc2gtbG9hZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJlc29sdmUocGF0aF8pO1xyXG4gICAgICB9KTsgICAgXHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC50aGVuKChwYXRoXyk9PntcclxuICAgIHJldHVybiBQcm9taXNlLmFsbChbbmV3IFByb21pc2UoKHJlc29sdmUscmVqZWN0KT0+e1xyXG4gICAgICBjb25zb2xlLmxvZygnbG9hZGVkLicpO1xyXG4gICAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ3BsYXknLHBhdGhfKTtcclxuICAgICAgaXBjLm9uKCdlbmQnLCgpPT57XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgICAscGxheWVyLnByZXBhcmVDYWNoZSgnL01PVklFL1NPVU5EL0JHLkFJRicpXHJcbiAgICAscGxheWVyLnByZXBhcmVDYWNoZSgnL01PVklFL1NPVU5ELzAzXzAyLkFJRicpXHJcbiAgICAscGxheWVyLnByZXBhcmVDYWNoZSgnL01PVklFL1NPVU5ELzE5XzAyLkFJRicpXHJcbiAgICBdKTtcclxuICB9KVxyXG4gIC50aGVuKChhcmdzKT0+e1xyXG4gICAgY29uc29sZS5sb2coJ0ppbmdsZSBZLk0uTy4gcGxheWVkLicpO1xyXG4gICAgICBtYWluV2luZG93LmxvYWRVcmwoJ2ZpbGU6Ly8nICsgX19kaXJuYW1lICsgJy8uLi9odG1sL21lbnUuaHRtbCcpO1xyXG4gICAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLm9uKCdkaWQtZmluaXNoLWxvYWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ2F1ZGlvUmVzb3VyY2UnLGFyZ3Muc2xpY2UoMikpO1xyXG4gICAgICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgncGxheUF1ZGlvJyxhcmdzWzFdLHtsb29wOnRydWV9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpcGMub24oJ2NsaWNrJywoZSxhcmcpPT57XHJcbiAgICAgICAgY29uc29sZS5sb2coYXJnKTtcclxuICAgICAgICBzd2l0Y2goYXJnKXtcclxuICAgICAgICAgIGNhc2UgJ1JlbWl4JzpcclxuICAgICAgICAgICAgbWFpbldpbmRvdy5sb2FkVXJsKCdmaWxlOi8vJyArIF9fZGlybmFtZSArICcvLi4vaHRtbC9yZW1peC5odG1sJyk7XHJcbiAgICAgICAgICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMub24oJ2RpZC1maW5pc2gtbG9hZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIGluaXRDYWNoZUZvclJlbWl4KClcclxuICAgICAgICAgICAgICAudGhlbigocmVzb3VyY2VzKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgncmVzb3VyY2VzJyxyZXNvdXJjZXMpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlICdJbnRlcnZpZXcnOlxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgJ1NhbXBsZSc6XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSAnVHJhY2tzJzpcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlICdSYXJlVmlkZW9zJzpcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlICdSYXJlVHJhY2tzJzpcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlICdFeGl0JzpcclxuICAgICAgICAgICAgYXBwLnF1aXQoKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlICdNZW51JzpcclxuICAgICAgICAgICAgbWFpbldpbmRvdy5sb2FkVXJsKCdmaWxlOi8vJyArIF9fZGlybmFtZSArICcvLi4vaHRtbC9tZW51Lmh0bWwnKTtcclxuICAgICAgICAgICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vbignZGlkLWZpbmlzaC1sb2FkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdhdWRpb1Jlc291cmNlJyxhcmdzLnNsaWNlKDIpKTtcclxuICAgICAgICAgICAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ3BsYXlBdWRpbycsYXJnc1sxXSx7bG9vcDp0cnVlfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH0pICAgIFxyXG4gIH0pXHJcbiAgLmNhdGNoKChlKT0+e1xyXG4gICAgdmFyIGRpYWxvZyA9IHJlcXVpcmUoJ2RpYWxvZycpO1xyXG4gICAgZGlhbG9nLnNob3dFcnJvckJveCgnRXJyb3InLGUpO1xyXG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT0gJ2RhcndpbicpXHJcbiAgICAgIGFwcC5xdWl0KCk7XHJcbi8vICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gIH0pO1xyXG4gIC8vYXBwLnF1aXQoKTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBpbml0Q2FjaGVGb3JSZW1peCgpXHJcbntcclxuICB2YXIgcmVzb3VyY2VzID0gW1xyXG4gIHtzb25nbmFtZTonQmVoaW5kIFRoZSBNYXNrJyxwYXRoOicvTU9WSUUvTDIvUkVNSVgvQkVISU5EUy9CQUNLSU5HLkFJRid9LFxyXG4gIHtzb25nbmFtZTonQmVoaW5kIFRoZSBNYXNrJyxwYXRoOicvTU9WSUUvTDIvUkVNSVgvQkVISU5EUy9CQVNTLkFJRid9LFxyXG4gIHtzb25nbmFtZTonQmVoaW5kIFRoZSBNYXNrJyxwYXRoOicvTU9WSUUvTDIvUkVNSVgvQkVISU5EUy9EUlVNUy5BSUYnfSxcclxuICB7c29uZ25hbWU6J0JlaGluZCBUaGUgTWFzaycscGF0aDonL01PVklFL0wyL1JFTUlYL0JFSElORFMvRV9EUlVNLkFJRid9LFxyXG4gIHtzb25nbmFtZTonQmVoaW5kIFRoZSBNYXNrJyxwYXRoOicvTU9WSUUvTDIvUkVNSVgvQkVISU5EUy9NRUxPXzEuQUlGJ30sXHJcbiAge3NvbmduYW1lOidCZWhpbmQgVGhlIE1hc2snLHBhdGg6Jy9NT1ZJRS9MMi9SRU1JWC9CRUhJTkRTL01FTE9fMi5BSUYnfSxcclxuICB7c29uZ25hbWU6J0JlaGluZCBUaGUgTWFzaycscGF0aDonL01PVklFL0wyL1JFTUlYL0JFSElORFMvVk9DT0RFUi5BSUYnfSxcclxuICB7c29uZ25hbWU6J1J5ZGVlbicscGF0aDonL01PVklFL0wyL1JFTUlYL1JZREVFTlMvQkFTUy5BSUYnfSxcclxuICB7c29uZ25hbWU6J1J5ZGVlbicscGF0aDonL01PVklFL0wyL1JFTUlYL1JZREVFTlMvQ0hPUkRfTFIuQUlGJ30sXHJcbiAge3NvbmduYW1lOidSeWRlZW4nLHBhdGg6Jy9NT1ZJRS9MMi9SRU1JWC9SWURFRU5TL0RSVU1TLkFJRid9LFxyXG4gIHtzb25nbmFtZTonUnlkZWVuJyxwYXRoOicvTU9WSUUvTDIvUkVNSVgvUllERUVOUy9NRUxPXzFMUi5BSUYnfSxcclxuICB7c29uZ25hbWU6J1J5ZGVlbicscGF0aDonL01PVklFL0wyL1JFTUlYL1JZREVFTlMvTUVMT18yLkFJRid9LFxyXG4gIHtzb25nbmFtZTonUnlkZWVuJyxwYXRoOicvTU9WSUUvTDIvUkVNSVgvUllERUVOUy9QRVJDX0xSLkFJRid9LFxyXG4gIHtzb25nbmFtZTonUnlkZWVuJyxwYXRoOicvTU9WSUUvTDIvUkVNSVgvUllERUVOUy9TRVEuQUlGJ30sXHJcbiAge3NvbmduYW1lOidTb2xpZCBTdGF0ZSBTdXJ2aXZvcicscGF0aDonL01PVklFL0wyL1JFTUlYL1NPTElEUy9CQVNTX0xSLkFJRid9LFxyXG4gIHtzb25nbmFtZTonU29saWQgU3RhdGUgU3Vydml2b3InLHBhdGg6Jy9NT1ZJRS9MMi9SRU1JWC9TT0xJRFMvRFJVTVMuQUlGJ30sXHJcbiAge3NvbmduYW1lOidTb2xpZCBTdGF0ZSBTdXJ2aXZvcicscGF0aDonL01PVklFL0wyL1JFTUlYL1NPTElEUy9NRUxPLkFJRid9LFxyXG4gIHtzb25nbmFtZTonU29saWQgU3RhdGUgU3Vydml2b3InLHBhdGg6Jy9NT1ZJRS9MMi9SRU1JWC9TT0xJRFMvUEVSQ19MUi5BSUYnfSxcclxuICB7c29uZ25hbWU6J1NvbGlkIFN0YXRlIFN1cnZpdm9yJyxwYXRoOicvTU9WSUUvTDIvUkVNSVgvU09MSURTL1NFLkFJRid9LFxyXG4gIHtzb25nbmFtZTonU29saWQgU3RhdGUgU3Vydml2b3InLHBhdGg6Jy9NT1ZJRS9MMi9SRU1JWC9TT0xJRFMvU1lOR1RfTFIuQUlGJ30sXHJcbiAge3NvbmduYW1lOidTb2xpZCBTdGF0ZSBTdXJ2aXZvcicscGF0aDonL01PVklFL0wyL1JFTUlYL1NPTElEUy9WT0NBTC5BSUYnfSxcclxuICB7c29uZ25hbWU6J1RlY2hub3BvbGlzJyxwYXRoOicvTU9WSUUvTDIvUkVNSVgvVEVDSE5PUy9CQVNTLkFJRid9LFxyXG4gIHtzb25nbmFtZTonVGVjaG5vcG9saXMnLHBhdGg6Jy9NT1ZJRS9MMi9SRU1JWC9URUNITk9TL0NIT1JEX0xSLkFJRid9LFxyXG4gIHtzb25nbmFtZTonVGVjaG5vcG9saXMnLHBhdGg6Jy9NT1ZJRS9MMi9SRU1JWC9URUNITk9TL0RSVU1TLkFJRid9LFxyXG4gIHtzb25nbmFtZTonVGVjaG5vcG9saXMnLHBhdGg6Jy9NT1ZJRS9MMi9SRU1JWC9URUNITk9TL0VUQy5BSUYnfSxcclxuICB7c29uZ25hbWU6J1RlY2hub3BvbGlzJyxwYXRoOicvTU9WSUUvTDIvUkVNSVgvVEVDSE5PUy9NRUxPX0xSLkFJRid9LFxyXG4gIHtzb25nbmFtZTonVGVjaG5vcG9saXMnLHBhdGg6Jy9NT1ZJRS9MMi9SRU1JWC9URUNITk9TL1RPQklfTFIuQUlGJ30sXHJcbiAge3NvbmduYW1lOidUZWNobm9wb2xpcycscGF0aDonL01PVklFL0wyL1JFTUlYL1RFQ0hOT1MvVk9DT0RFUi5BSUYnfSxcclxuICB7c29uZ25hbWU6J1RvbmcgUG9vJyxwYXRoOicvTU9WSUUvTDIvUkVNSVgvVE9OR1MvQkFTUy5BSUYnfSxcclxuICB7c29uZ25hbWU6J1RvbmcgUG9vJyxwYXRoOicvTU9WSUUvTDIvUkVNSVgvVE9OR1MvQ0hPUkRfTFIuQUlGJ30sXHJcbiAge3NvbmduYW1lOidUb25nIFBvbycscGF0aDonL01PVklFL0wyL1JFTUlYL1RPTkdTL0RSVU0uQUlGJ30sXHJcbiAge3NvbmduYW1lOidUb25nIFBvbycscGF0aDonL01PVklFL0wyL1JFTUlYL1RPTkdTL0VfRFJVTVMuQUlGJ30sXHJcbiAge3NvbmduYW1lOidUb25nIFBvbycscGF0aDonL01PVklFL0wyL1JFTUlYL1RPTkdTL01FTE8uQUlGJ30sXHJcbiAge3NvbmduYW1lOidUb25nIFBvbycscGF0aDonL01PVklFL0wyL1JFTUlYL1RPTkdTL09CVVJJX0xSLkFJRid9LFxyXG4gIHtzb25nbmFtZTonVG9uZyBQb28nLHBhdGg6Jy9NT1ZJRS9MMi9SRU1JWC9UT05HUy9WT0NBTC5BSUYnfVxyXG4gIF07XHJcbiAgdmFyIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcclxuICB2YXIgcmVzID0gW107XHJcbiAgdmFyIGxlbiA9IHJlc291cmNlcy5sZW5ndGg7XHJcbiAgdmFyIGlkeCA9IDA7XHJcbiAgXHJcbiAgd2hpbGUoaWR4IDwgbGVuKVxyXG4gIHtcclxuICAgIHZhciByZiA9IFtdO1xyXG4gICAgZm9yKHZhciBpID0gMDtpIDwgMTAgJiYgKGlkeCA8IGxlbik7KytpKXtcclxuICAgICAgdmFyIHIgPSByZXNvdXJjZXNbaWR4XTtcclxuICAgICAgcmYucHVzaChyKTtcclxuICAgICAgKytpZHg7XHJcbiAgICB9XHJcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgocmYpPT4ge1xyXG4gICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgIHZhciBhcnIgPSBbXTtcclxuICAgICAgICByZi5mb3JFYWNoKChyKSA9PiB7XHJcbiAgICAgICAgICBhcnIucHVzaChcclxuICAgICAgICAgICAgcGxheWVyLnByZXBhcmVDYWNoZShyLnBhdGgsJy5vZ2cnKVxyXG4gICAgICAgICAgICAudGhlbigoY2FjaGVQYXRoKT0+e1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNhY2hlUGF0aCk7XHJcbiAgICAgICAgICAgICAgcmVzLnB1c2goe3NvbmduYW1lOnIuc29uZ25hbWUscGF0aDpjYWNoZVBhdGh9KTtcclxuICAgICAgICAgIH0pKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoYXJyKTtcclxuICAgICAgfVxyXG4gICAgfSkocmYpKTtcclxuICB9XHJcbiAgcmV0dXJuIHByb21pc2UudGhlbigoKT0+IHJlcyk7XHJcbn1cclxuXHJcblxyXG5cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
