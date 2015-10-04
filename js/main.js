'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
ipc.setMaxListeners(0);
var fs = require('fs');
var path = require('path');
var ffmpeg = require('basicFFmpeg');
var cacheRoot = path.join(app.getPath('cache'), 'sfpgmr');
var cachePath = path.join(cacheRoot, 'gigacapsule');
var workPath = path.join(cachePath, 'work');
var gigaCapsule = '';
var mkdir = denodeify(fs.mkdir);
var access = denodeify(fs.access);
var exec = denodeify(require('child_process').exec);
var playPromises = Promise.resolve(0);
var cachePromises = Promise.resolve(0);

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') app.quit();
});

function denodeify(nodeFunc) {
  var baseArgs = Array.prototype.slice.call(arguments, 1);
  return function () {
    var _arguments = arguments;

    var nodeArgs = baseArgs.concat(Array.prototype.slice.call(arguments));
    return new Promise(function (resolve, reject) {
      nodeArgs.push(function (error, data) {
        if (error) {
          reject(error);
        } else if (_arguments.length > 2) {
          resolve(Array.prototype.slice.call(_arguments, 1));
        } else {
          resolve(data);
        }
      });
      nodeFunc.apply(null, nodeArgs);
    });
  };
}

app.on('ready', function () {
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
  }).then(makeDir(cacheRoot)).then(makeDir(cachePath)).then(makeDir(workPath))
  // .then(()=>{
  //   return mkdir(cachePath);
  //   },(e)=>{
  //     if(e.code !== 'EEXIST'){
  //       return Promise.reject(e);
  //     } else {
  //       return mkdir(cachePath);
  //     }
  // })
  // .then(()=> Promise.resolve(),
  //   (e)=>{
  //     if(e.code !== 'EEXIST'){
  //       Promise.reject(e);
  //     }
  //     return Promise.resolve();
  //   }
  // )
  // .then(()=>{
  //   return mkdir(workPath)
  //   .then(()=> Promise.resolve(),
  //     (e) =>{
  //       if(e.code !== 'EEXIST'){
  //         Promise.reject(e);
  //       }
  //       return Promise.resolve();
  //     });
  // })
  .then(function () {
    return new Promise(function (resolve, reject) {
      // ブラウザ(Chromium)の起動, 初期画面のロード
      mainWindow = new BrowserWindow({
        'width': 1024,
        'height': 768,
        'use-content-size': true,
        'center': true,
        'auto-hide-menu-bar': true,
        'title': 'YMO Giga Capusle Viewer',
        'web-preferences': {
          'direct-write': true
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
  // コンテンツの再生
  .then(function () {
    // playVideo('/MOVIE/QT/TITLE');
    // playVideo('/MOVIE/QT/START_H');
    // playAudio('/MOVIE/SOUND/OPENING');
    // playAudio('/SAMPLING/03FIRECR/03_01');
    // playAudio('/SAMPLING/03FIRECR/03_02');
    // playAudio('/SAMPLING/03FIRECR/03_03');
    // playAudio('/SAMPLING/03FIRECR/03_04');
    // playAudio('/SAMPLING/03FIRECR/03_05');
    // playAudio('/MOVIE/L1/SOUNDS/12_7');
    // playAudio('/MOVIE/L1/SOUNDS/12_8');
    playAudio('/MOVIE/L1/SOUNDS/12_9');
    playAudio('/MOVIE/L1/SOUNDS/12_10');
    playAudio('/MOVIE/L1/SOUNDS/12_11');
    playAudio('/MOVIE/L1/SOUNDS/12_12');
    playAudio('/MOVIE/L1/SOUNDS/4_1');
    playAudio('/MOVIE/L1/SOUNDS/4_2');
    playAudio('/MOVIE/L1/SOUNDS/4_3');
    playAudio('/MOVIE/L1/SOUNDS/4_4');
    playAudio('/MOVIE/L1/SOUNDS/4_5');
    playAudio('/MOVIE/L1/SOUNDS/4_6');
    playAudio('/MOVIE/L1/SOUNDS/4_7');
    playAudio('/MOVIE/L1/SOUNDS/4_8');
    playAudio('/MOVIE/L1/SOUNDS/12_1');
    playAudio('/MOVIE/L1/SOUNDS/12_2');
    playAudio('/MOVIE/L1/SOUNDS/12_3');
    playAudio('/MOVIE/L1/SOUNDS/12_4');
    playAudio('/MOVIE/L1/SOUNDS/12_5');
    playAudio('/MOVIE/L1/SOUNDS/12_6');

    return playPromises;
  }).then(function () {
    console.log('play end.');
    playPromises = Promise.resolve(0);
    cachePromises = Promise.resolve(0);
  })['catch'](function (e) {
    var dialog = require('dialog');
    dialog.showErrorBox('Error', e);
    //    console.log(e);
  });
  //app.quit();
});

function makeDir(path) {
  return function () {
    return mkdir(path).then(function () {
      return Promise.resolve();
    }, function (e) {
      if (e.code !== 'EEXIST') {
        Promise.reject(e);
      }
      return Promise.resolve();
    });
  };
}

// 動画ファイルのキャッシュ生成
function makeMovCache(pathFlagment) {
  var pathSrc = path.join(gigaCapsule, pathFlagment + '.MOV');
  var pathDest = path.join(cachePath, pathFlagment.replace(/\//ig, '_') + '.mp4');
  return makeCache(pathSrc, pathDest);
}

// オーディオファイルのキャッシュ生成
function makeAudioCache(pathFlagment) {
  var pathSrc = path.join(gigaCapsule, pathFlagment + '.AIF');
  var pathDest = path.join(cachePath, pathFlagment.replace(/\//ig, '_') + '.opus');
  return makeCache(pathSrc, pathDest);
}

// ビデオの再生
function playVideo(path) {
  var cachePromise = makeMovCache(path);
  // Promiseのチェインを2つ（キャッシュチェイン、再生チェイン）作る
  // 再生中に後続のデータのキャッシュを作れるようにするため

  // キャッシュのチェイン
  // 先行のキャッシュ生成が終わったらキャッシュ生成をシーケンシャルに行う
  cachePromises = cachePromises.then(function () {
    return cachePromise;
  });
  // 再生のチェイン
  // 先行の再生完了 -> キャッシュの生成終了まち -> 再生をシーケンシャルに行う
  playPromises = playPromises.then(function () {
    return cachePromise;
  }).then(playVideo_);
}

// オーディオの再生
function playAudio(path) {
  var cachePromise = makeAudioCache(path);
  // Promiseのチェインを2つ（キャッシュチェイン、再生チェイン）作る
  // 再生中に後続のデータのキャッシュを作れるようにするため

  // キャッシュのチェイン
  // 先行のキャッシュ生成が終わったらキャッシュ生成をシーケンシャルに行う
  cachePromises = cachePromises.then(function () {
    return cachePromise;
  });
  // 再生のチェイン
  // 先行の再生完了 -> キャッシュの生成終了まち -> 再生をシーケンシャルに行う
  playPromises = playPromises.then(function () {
    return cachePromise;
  }).then(playAudio_);
}

// コンテンツを再生可能な形式に変換し、キャッシュする
function makeCache(src, dest, option) {
  option = option || '';
  return access(dest, fs.F_OK).then(function () {
    return Promise.resolve(dest);
  }, // resolve
  function () {
    // reject
    // 作業中のファイルはテンポラリに保存
    var tmpPath = path.join(workPath, path.basename(dest));
    console.log(src, tmpPath);
    // ffmpegでファイル変換
    return exec('ffmpeg.exe -y -loglevel fatal -i ' + src + ' ' + option + ' ' + tmpPath)
    // 変換からテンポラリから移動
    .then(exec.bind(null, 'cmd /c move /Y ' + tmpPath + ' ' + dest), function (e) {
      console.log(e);
    })
    // 変換後のファイル名を返す
    .then(function () {
      return Promise.resolve(dest);
    });
  });
}

// ビデオの再生
function playVideo_(path) {
  return new Promise(function (resolve, reject) {
    mainWindow.webContents.send('playVideo', path);
    ipc.once('playVideoEnd', function () {
      resolve();
      console.log(path);
    });
  });
}

// オーディオの再生
function playAudio_(path) {
  return new Promise(function (resolve, reject) {
    mainWindow.webContents.send('playAudio', path);
    ipc.once('playAudioEnd', function () {
      resolve();
      console.log(path);
    });
  });
}
//# sourceMappingURL=data:application/json;base64,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QUFDO0FBQzlDLE9BQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFDLFlBQVU7QUFDaEMsYUFBTyxFQUFFLENBQUM7QUFDVixhQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ25CLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKOzs7QUFHRCxTQUFTLFVBQVUsQ0FBQyxJQUFJLEVBQUM7QUFDdkIsU0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBQyxNQUFNLEVBQUc7QUFDbkMsY0FBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlDLE9BQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFDLFlBQVU7QUFDaEMsYUFBTyxFQUFFLENBQUM7QUFDVixhQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ25CLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgYXBwID0gcmVxdWlyZSgnYXBwJyk7XHJcbnZhciBCcm93c2VyV2luZG93ID0gcmVxdWlyZSgnYnJvd3Nlci13aW5kb3cnKTtcclxudmFyIGlwYyA9IHJlcXVpcmUoJ2lwYycpO1xyXG5pcGMuc2V0TWF4TGlzdGVuZXJzKDApO1xyXG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xyXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcclxudmFyIGZmbXBlZyA9IHJlcXVpcmUoJ2Jhc2ljRkZtcGVnJyk7XHJcbnZhciBjYWNoZVJvb3QgPSBwYXRoLmpvaW4oYXBwLmdldFBhdGgoJ2NhY2hlJyksJ3NmcGdtcicpO1xyXG52YXIgY2FjaGVQYXRoID0gcGF0aC5qb2luKGNhY2hlUm9vdCwnZ2lnYWNhcHN1bGUnKTtcclxudmFyIHdvcmtQYXRoID0gcGF0aC5qb2luKGNhY2hlUGF0aCwnd29yaycpO1xyXG52YXIgZ2lnYUNhcHN1bGUgPSAnJztcclxudmFyIG1rZGlyID0gZGVub2RlaWZ5KGZzLm1rZGlyKTtcclxudmFyIGFjY2VzcyA9IGRlbm9kZWlmeShmcy5hY2Nlc3MpO1xyXG52YXIgZXhlYyA9IGRlbm9kZWlmeShyZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlYyk7XHJcbnZhciBwbGF5UHJvbWlzZXMgPSBQcm9taXNlLnJlc29sdmUoMCk7XHJcbnZhciBjYWNoZVByb21pc2VzID0gUHJvbWlzZS5yZXNvbHZlKDApO1xyXG5cclxucmVxdWlyZSgnY3Jhc2gtcmVwb3J0ZXInKS5zdGFydCgpO1xyXG5cclxudmFyIG1haW5XaW5kb3cgPSBudWxsO1xyXG5cclxuYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsIGZ1bmN0aW9uKCkge1xyXG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9ICdkYXJ3aW4nKVxyXG4gICAgYXBwLnF1aXQoKTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBkZW5vZGVpZnkobm9kZUZ1bmMpe1xyXG4gICAgdmFyIGJhc2VBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbm9kZUFyZ3MgPSBiYXNlQXJncy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbm9kZUFyZ3MucHVzaCgoZXJyb3IsIGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIG5vZGVGdW5jLmFwcGx5KG51bGwsIG5vZGVBcmdzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmFwcC5vbigncmVhZHknLCBmdW5jdGlvbigpIHtcclxuICAvLyBHaWdhIENhcHN1bGUg44OH44Kj44K544Kv44KS44OB44Kn44OD44Kv44GZ44KLXHJcbiAgLy8gV2luZG93cyDjga7jgb8uLi5cclxuICBleGVjKCd3bWljIGxvZ2ljYWxkaXNrIGdldCBjYXB0aW9uJylcclxuICAudGhlbigoc3Rkb3V0LHN0ZGVycikgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCkgPT4ge1xyXG4gICAgICAgIHN0ZG91dC5zcGxpdCgvXFxyXFxyXFxuLykuZm9yRWFjaCgoZCk9PntcclxuICAgICAgICAgIGlmKGQubWF0Y2goL1xcOi8pKXtcclxuICAgICAgICAgICAgbGV0IGRyaXZlID0gZC50cmltKCk7XHJcbiAgICAgICAgICAgIGlmKGZzLmV4aXN0c1N5bmMoZHJpdmUgKyAnL1lNT0dJR0EuRVhFJykpe1xyXG4gICAgICAgICAgICAgIHJlc29sdmUoZHJpdmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmVqZWN0KCdHaWdhIENhcHN1bGUgRGlzayBOb3QgRm91bmQuJyk7XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC50aGVuKChkcml2ZSk9PntcclxuICAgIC8vIEdpZ2EgQ2Fwc3VsZeOBruODieODqeOCpOODluWIpOaYjlxyXG4gICAgZ2lnYUNhcHN1bGUgPSBwYXRoLmpvaW4oZHJpdmUsJy8nKTtcclxuICAgIGNvbnNvbGUubG9nKGdpZ2FDYXBzdWxlKTtcclxuICAgIC8vIOOCreODo+ODg+OCt+ODpeODh+OCo+ODrOOCr+ODiOODquS9nOaIkFxyXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH0pXHJcbiAgLnRoZW4obWFrZURpcihjYWNoZVJvb3QpKVxyXG4gIC50aGVuKG1ha2VEaXIoY2FjaGVQYXRoKSlcclxuICAudGhlbihtYWtlRGlyKHdvcmtQYXRoKSlcclxuICAvLyAudGhlbigoKT0+e1xyXG4gIC8vICAgcmV0dXJuIG1rZGlyKGNhY2hlUGF0aCk7XHJcbiAgLy8gICB9LChlKT0+e1xyXG4gIC8vICAgICBpZihlLmNvZGUgIT09ICdFRVhJU1QnKXtcclxuICAvLyAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZSk7XHJcbiAgLy8gICAgIH0gZWxzZSB7XHJcbiAgLy8gICAgICAgcmV0dXJuIG1rZGlyKGNhY2hlUGF0aCk7XHJcbiAgLy8gICAgIH1cclxuICAvLyB9KVxyXG4gIC8vIC50aGVuKCgpPT4gUHJvbWlzZS5yZXNvbHZlKCksXHJcbiAgLy8gICAoZSk9PntcclxuICAvLyAgICAgaWYoZS5jb2RlICE9PSAnRUVYSVNUJyl7XHJcbiAgLy8gICAgICAgUHJvbWlzZS5yZWplY3QoZSk7XHJcbiAgLy8gICAgIH0gXHJcbiAgLy8gICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAvLyAgIH1cclxuICAvLyApXHJcbiAgLy8gLnRoZW4oKCk9PntcclxuICAvLyAgIHJldHVybiBta2Rpcih3b3JrUGF0aClcclxuICAvLyAgIC50aGVuKCgpPT4gUHJvbWlzZS5yZXNvbHZlKCksXHJcbiAgLy8gICAgIChlKSA9PntcclxuICAvLyAgICAgICBpZihlLmNvZGUgIT09ICdFRVhJU1QnKXtcclxuICAvLyAgICAgICAgIFByb21pc2UucmVqZWN0KGUpO1xyXG4gIC8vICAgICAgIH0gXHJcbiAgLy8gICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gIC8vICAgICB9KTtcclxuICAvLyB9KVxyXG4gIC50aGVuKCgpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCl7XHJcbiAgICAvLyDjg5bjg6njgqbjgrYoQ2hyb21pdW0p44Gu6LW35YuVLCDliJ3mnJ/nlLvpnaLjga7jg63jg7zjg4lcclxuICAgICAgbWFpbldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICd3aWR0aCc6IDEwMjQsXHJcbiAgICAgICAgICAnaGVpZ2h0JzogNzY4LFxyXG4gICAgICAgICAgJ3VzZS1jb250ZW50LXNpemUnOnRydWUsXHJcbiAgICAgICAgICAnY2VudGVyJzp0cnVlLFxyXG4gICAgICAgICAgJ2F1dG8taGlkZS1tZW51LWJhcic6IHRydWUsXHJcbiAgICAgICAgICAndGl0bGUnOidZTU8gR2lnYSBDYXB1c2xlIFZpZXdlcicsXHJcbiAgICAgICAgICAnd2ViLXByZWZlcmVuY2VzJzp7XHJcbiAgICAgICAgICAgICdkaXJlY3Qtd3JpdGUnOiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgICBtYWluV2luZG93LmxvYWRVcmwoJ2ZpbGU6Ly8nICsgX19kaXJuYW1lICsgJy8uLi9pbmRleC5odG1sJyk7XHJcbiAgICAgIG1haW5XaW5kb3cub24oJ2Nsb3NlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIG1haW5XaW5kb3cgPSBudWxsO1xyXG4gICAgICB9KTtcclxuICAgICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vbignZGlkLWZpbmlzaC1sb2FkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9KTsgICAgXHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC8vIOOCs+ODs+ODhuODs+ODhOOBruWGjeeUn1xyXG4gIC50aGVuKCgpPT57XHJcbiAgICAvLyBwbGF5VmlkZW8oJy9NT1ZJRS9RVC9USVRMRScpO1xyXG4gICAgLy8gcGxheVZpZGVvKCcvTU9WSUUvUVQvU1RBUlRfSCcpOyBcclxuICAgIC8vIHBsYXlBdWRpbygnL01PVklFL1NPVU5EL09QRU5JTkcnKTtcclxuICAgIC8vIHBsYXlBdWRpbygnL1NBTVBMSU5HLzAzRklSRUNSLzAzXzAxJyk7XHJcbiAgICAvLyBwbGF5QXVkaW8oJy9TQU1QTElORy8wM0ZJUkVDUi8wM18wMicpO1xyXG4gICAgLy8gcGxheUF1ZGlvKCcvU0FNUExJTkcvMDNGSVJFQ1IvMDNfMDMnKTtcclxuICAgIC8vIHBsYXlBdWRpbygnL1NBTVBMSU5HLzAzRklSRUNSLzAzXzA0Jyk7XHJcbiAgICAvLyBwbGF5QXVkaW8oJy9TQU1QTElORy8wM0ZJUkVDUi8wM18wNScpO1xyXG4gICAgLy8gcGxheUF1ZGlvKCcvTU9WSUUvTDEvU09VTkRTLzEyXzcnKTtcclxuICAgIC8vIHBsYXlBdWRpbygnL01PVklFL0wxL1NPVU5EUy8xMl84Jyk7XHJcbiAgICBwbGF5QXVkaW8oJy9NT1ZJRS9MMS9TT1VORFMvMTJfOScpO1xyXG4gICAgcGxheUF1ZGlvKCcvTU9WSUUvTDEvU09VTkRTLzEyXzEwJyk7XHJcbiAgICBwbGF5QXVkaW8oJy9NT1ZJRS9MMS9TT1VORFMvMTJfMTEnKTtcclxuICAgIHBsYXlBdWRpbygnL01PVklFL0wxL1NPVU5EUy8xMl8xMicpO1xyXG4gICAgcGxheUF1ZGlvKCcvTU9WSUUvTDEvU09VTkRTLzRfMScpO1xyXG4gICAgcGxheUF1ZGlvKCcvTU9WSUUvTDEvU09VTkRTLzRfMicpO1xyXG4gICAgcGxheUF1ZGlvKCcvTU9WSUUvTDEvU09VTkRTLzRfMycpO1xyXG4gICAgcGxheUF1ZGlvKCcvTU9WSUUvTDEvU09VTkRTLzRfNCcpO1xyXG4gICAgcGxheUF1ZGlvKCcvTU9WSUUvTDEvU09VTkRTLzRfNScpO1xyXG4gICAgcGxheUF1ZGlvKCcvTU9WSUUvTDEvU09VTkRTLzRfNicpO1xyXG4gICAgcGxheUF1ZGlvKCcvTU9WSUUvTDEvU09VTkRTLzRfNycpO1xyXG4gICAgcGxheUF1ZGlvKCcvTU9WSUUvTDEvU09VTkRTLzRfOCcpO1xyXG4gICAgcGxheUF1ZGlvKCcvTU9WSUUvTDEvU09VTkRTLzEyXzEnKTtcclxuICAgIHBsYXlBdWRpbygnL01PVklFL0wxL1NPVU5EUy8xMl8yJyk7XHJcbiAgICBwbGF5QXVkaW8oJy9NT1ZJRS9MMS9TT1VORFMvMTJfMycpO1xyXG4gICAgcGxheUF1ZGlvKCcvTU9WSUUvTDEvU09VTkRTLzEyXzQnKTtcclxuICAgIHBsYXlBdWRpbygnL01PVklFL0wxL1NPVU5EUy8xMl81Jyk7XHJcbiAgICBwbGF5QXVkaW8oJy9NT1ZJRS9MMS9TT1VORFMvMTJfNicpO1xyXG5cclxuICAgIHJldHVybiBwbGF5UHJvbWlzZXM7XHJcbiAgfSkudGhlbigoKT0+e1xyXG4gICAgY29uc29sZS5sb2coJ3BsYXkgZW5kLicpO1xyXG4gICAgcGxheVByb21pc2VzID0gUHJvbWlzZS5yZXNvbHZlKDApO1xyXG4gICAgY2FjaGVQcm9taXNlcyA9IFByb21pc2UucmVzb2x2ZSgwKTtcclxuICB9KVxyXG4gIC5jYXRjaCgoZSk9PntcclxuICAgIHZhciBkaWFsb2cgPSByZXF1aXJlKCdkaWFsb2cnKTtcclxuICAgIGRpYWxvZy5zaG93RXJyb3JCb3goJ0Vycm9yJyxlKTtcclxuLy8gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfSk7XHJcbiAgLy9hcHAucXVpdCgpO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIG1ha2VEaXIocGF0aCl7XHJcbiAgIHJldHVybiAoKT0+e1xyXG4gICAgcmV0dXJuIG1rZGlyKHBhdGgpXHJcbiAgICAudGhlbigoKT0+IFByb21pc2UucmVzb2x2ZSgpLFxyXG4gICAgICAoZSkgPT57XHJcbiAgICAgICAgaWYoZS5jb2RlICE9PSAnRUVYSVNUJyl7XHJcbiAgICAgICAgICBQcm9taXNlLnJlamVjdChlKTtcclxuICAgICAgICB9IFxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgfSk7XHJcbiAgIH0gIFxyXG59XHJcblxyXG4vLyDli5XnlLvjg5XjgqHjgqTjg6vjga7jgq3jg6Pjg4Pjgrfjg6XnlJ/miJBcclxuZnVuY3Rpb24gbWFrZU1vdkNhY2hlKHBhdGhGbGFnbWVudCl7XHJcbiAgdmFyIHBhdGhTcmMgPSBwYXRoLmpvaW4oZ2lnYUNhcHN1bGUscGF0aEZsYWdtZW50ICsgJy5NT1YnKTtcclxuICB2YXIgcGF0aERlc3QgPSBwYXRoLmpvaW4oY2FjaGVQYXRoLHBhdGhGbGFnbWVudC5yZXBsYWNlKC9cXC8vaWcsJ18nKSArICcubXA0Jyk7XHJcbiAgcmV0dXJuIG1ha2VDYWNoZShwYXRoU3JjLHBhdGhEZXN0KTtcclxufVxyXG5cclxuLy8g44Kq44O844OH44Kj44Kq44OV44Kh44Kk44Or44Gu44Kt44Oj44OD44K344Ol55Sf5oiQXHJcbmZ1bmN0aW9uIG1ha2VBdWRpb0NhY2hlKHBhdGhGbGFnbWVudCl7XHJcbiAgdmFyIHBhdGhTcmMgPSBwYXRoLmpvaW4oZ2lnYUNhcHN1bGUscGF0aEZsYWdtZW50ICsgJy5BSUYnKTtcclxuICB2YXIgcGF0aERlc3QgPSBwYXRoLmpvaW4oY2FjaGVQYXRoLHBhdGhGbGFnbWVudC5yZXBsYWNlKC9cXC8vaWcsJ18nKSArICcub3B1cycpO1xyXG4gIHJldHVybiBtYWtlQ2FjaGUocGF0aFNyYyxwYXRoRGVzdCk7XHJcbn1cclxuXHJcbi8vIOODk+ODh+OCquOBruWGjeeUn1xyXG5mdW5jdGlvbiBwbGF5VmlkZW8ocGF0aClcclxue1xyXG4gIHZhciBjYWNoZVByb21pc2UgPSBtYWtlTW92Q2FjaGUocGF0aCk7XHJcbiAgLy8gUHJvbWlzZeOBruODgeOCp+OCpOODs+OCkjLjgaTvvIjjgq3jg6Pjg4Pjgrfjg6Xjg4HjgqfjgqTjg7PjgIHlho3nlJ/jg4HjgqfjgqTjg7PvvInkvZzjgotcclxuICAvLyDlho3nlJ/kuK3jgavlvozntprjga7jg4fjg7zjgr/jga7jgq3jg6Pjg4Pjgrfjg6XjgpLkvZzjgozjgovjgojjgYbjgavjgZnjgovjgZ/jgoFcclxuXHJcbiAgLy8g44Kt44Oj44OD44K344Ol44Gu44OB44Kn44Kk44OzXHJcbiAgLy8g5YWI6KGM44Gu44Kt44Oj44OD44K344Ol55Sf5oiQ44GM57WC44KP44Gj44Gf44KJ44Kt44Oj44OD44K344Ol55Sf5oiQ44KS44K344O844Kx44Oz44K344Oj44Or44Gr6KGM44GGXHJcbiAgY2FjaGVQcm9taXNlcyA9IGNhY2hlUHJvbWlzZXMudGhlbigoKSA9PiBjYWNoZVByb21pc2UpO1xyXG4gIC8vIOWGjeeUn+OBruODgeOCp+OCpOODs1xyXG4gIC8vIOWFiOihjOOBruWGjeeUn+WujOS6hiAtPiDjgq3jg6Pjg4Pjgrfjg6Xjga7nlJ/miJDntYLkuobjgb7jgaEgLT4g5YaN55Sf44KS44K344O844Kx44Oz44K344Oj44Or44Gr6KGM44GGXHJcbiAgcGxheVByb21pc2VzID0gcGxheVByb21pc2VzLnRoZW4oKCkgPT4gY2FjaGVQcm9taXNlKS50aGVuKHBsYXlWaWRlb18pO1xyXG5cclxufVxyXG5cclxuLy8g44Kq44O844OH44Kj44Kq44Gu5YaN55SfXHJcbmZ1bmN0aW9uIHBsYXlBdWRpbyhwYXRoKXtcclxuICB2YXIgY2FjaGVQcm9taXNlID0gbWFrZUF1ZGlvQ2FjaGUocGF0aCk7XHJcbiAgLy8gUHJvbWlzZeOBruODgeOCp+OCpOODs+OCkjLjgaTvvIjjgq3jg6Pjg4Pjgrfjg6Xjg4HjgqfjgqTjg7PjgIHlho3nlJ/jg4HjgqfjgqTjg7PvvInkvZzjgotcclxuICAvLyDlho3nlJ/kuK3jgavlvozntprjga7jg4fjg7zjgr/jga7jgq3jg6Pjg4Pjgrfjg6XjgpLkvZzjgozjgovjgojjgYbjgavjgZnjgovjgZ/jgoFcclxuXHJcbiAgLy8g44Kt44Oj44OD44K344Ol44Gu44OB44Kn44Kk44OzXHJcbiAgLy8g5YWI6KGM44Gu44Kt44Oj44OD44K344Ol55Sf5oiQ44GM57WC44KP44Gj44Gf44KJ44Kt44Oj44OD44K344Ol55Sf5oiQ44KS44K344O844Kx44Oz44K344Oj44Or44Gr6KGM44GGXHJcbiAgY2FjaGVQcm9taXNlcyA9IGNhY2hlUHJvbWlzZXMudGhlbigoKT0+IGNhY2hlUHJvbWlzZSk7XHJcbiAgLy8g5YaN55Sf44Gu44OB44Kn44Kk44OzXHJcbiAgLy8g5YWI6KGM44Gu5YaN55Sf5a6M5LqGIC0+IOOCreODo+ODg+OCt+ODpeOBrueUn+aIkOe1guS6huOBvuOBoSAtPiDlho3nlJ/jgpLjgrfjg7zjgrHjg7Pjgrfjg6Pjg6vjgavooYzjgYZcclxuICBwbGF5UHJvbWlzZXMgPSBwbGF5UHJvbWlzZXMudGhlbigoKSA9PiBjYWNoZVByb21pc2UpLnRoZW4ocGxheUF1ZGlvXyk7XHJcbn1cclxuXHJcbi8vIOOCs+ODs+ODhuODs+ODhOOCkuWGjeeUn+WPr+iDveOBquW9ouW8j+OBq+WkieaPm+OBl+OAgeOCreODo+ODg+OCt+ODpeOBmeOCi1xyXG5mdW5jdGlvbiBtYWtlQ2FjaGUoc3JjLGRlc3Qsb3B0aW9uKVxyXG57XHJcbiAgICBvcHRpb24gPSBvcHRpb24gfHwgJyc7XHJcbiAgICByZXR1cm4gYWNjZXNzKGRlc3QsZnMuRl9PSylcclxuICAgIC50aGVuKCgpPT4gUHJvbWlzZS5yZXNvbHZlKGRlc3QpLC8vIHJlc29sdmVcclxuICAgICAgKCk9PnsvLyByZWplY3RcclxuICAgICAgICAvLyDkvZzmpa3kuK3jga7jg5XjgqHjgqTjg6vjga/jg4bjg7Pjg53jg6njg6rjgavkv53lrZhcclxuICAgICAgICB2YXIgdG1wUGF0aCA9IHBhdGguam9pbih3b3JrUGF0aCxwYXRoLmJhc2VuYW1lKGRlc3QpKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhzcmMsdG1wUGF0aCk7XHJcbiAgICAgICAgLy8gZmZtcGVn44Gn44OV44Kh44Kk44Or5aSJ5o+bXHJcbiAgICAgICAgcmV0dXJuIGV4ZWMoJ2ZmbXBlZy5leGUgLXkgLWxvZ2xldmVsIGZhdGFsIC1pICcgKyBzcmMgKyAnICcgKyBvcHRpb24gKyAnICcgKyB0bXBQYXRoKVxyXG4gICAgICAgICAgLy8g5aSJ5o+b44GL44KJ44OG44Oz44Od44Op44Oq44GL44KJ56e75YuVXHJcbiAgICAgICAgICAudGhlbihleGVjLmJpbmQobnVsbCwnY21kIC9jIG1vdmUgL1kgJyArIHRtcFBhdGggKyAnICcgKyBkZXN0KSwoZSk9Pntjb25zb2xlLmxvZyhlKTt9KVxyXG4gICAgICAgICAgLy8g5aSJ5o+b5b6M44Gu44OV44Kh44Kk44Or5ZCN44KS6L+U44GZXHJcbiAgICAgICAgICAudGhlbigoKT0+UHJvbWlzZS5yZXNvbHZlKGRlc3QpKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxufVxyXG5cclxuLy8g44OT44OH44Kq44Gu5YaN55SfXHJcbmZ1bmN0aW9uIHBsYXlWaWRlb18ocGF0aCl7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCk9PntcclxuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgncGxheVZpZGVvJyxwYXRoKTtcclxuICAgIGlwYy5vbmNlKCdwbGF5VmlkZW9FbmQnLGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJlc29sdmUoKTtcclxuICAgICAgY29uc29sZS5sb2cocGF0aCk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufVxyXG5cclxuLy8g44Kq44O844OH44Kj44Kq44Gu5YaN55SfXHJcbmZ1bmN0aW9uIHBsYXlBdWRpb18ocGF0aCl7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCk9PntcclxuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgncGxheUF1ZGlvJyxwYXRoKTtcclxuICAgIGlwYy5vbmNlKCdwbGF5QXVkaW9FbmQnLGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJlc29sdmUoKTtcclxuICAgICAgY29uc29sZS5sb2cocGF0aCk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufVxyXG5cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
