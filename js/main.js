'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var fs = require('fs');
var path = require('path');
var cacheRoot = path.join(app.getPath('cache'), 'sfpgmr');
var cachePath = path.join(cacheRoot, 'gigacapsule');
var gigaCapsule = '';

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
  var exec = denodeify(require('child_process').exec);
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
    // キャッシュディレクトリ作成
    return new Promise(function (resolve, reject) {
      try {
        fs.mkdirSync(cacheRoot);
      } catch (e) {
        if (e.code !== 'EEXIST') {
          reject(e.description);
        }
      }
      try {
        fs.mkdirSync(cachePath);
      } catch (e) {
        if (e.code !== 'EEXIST') {
          reject(e.description);
        }
      }
      resolve();
    });
  }).then(function () {
    // ブラウザ(Chromium)の起動, 初期画面のロード
    mainWindow = new BrowserWindow({ width: 800, height: 600 });
    mainWindow.loadUrl('file://' + __dirname + '/../index.html');
    mainWindow.on('closed', function () {
      mainWindow = null;
    });
  })['catch'](function (e) {
    console.log(e);
  });
  //app.quit();
});
//# sourceMappingURL=data:application/json;base64,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QUFDLFNBQ0ksQ0FBQyxVQUFDLENBQUMsRUFBRztBQUNWLFdBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDaEIsQ0FBQyxDQUFDOztDQUVKLENBQUMsQ0FBQyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGFwcCA9IHJlcXVpcmUoJ2FwcCcpO1xyXG52YXIgQnJvd3NlcldpbmRvdyA9IHJlcXVpcmUoJ2Jyb3dzZXItd2luZG93Jyk7XHJcbnZhciBpcGMgPSByZXF1aXJlKCdpcGMnKTtcclxudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcclxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XHJcbnZhciBjYWNoZVJvb3QgPSBwYXRoLmpvaW4oYXBwLmdldFBhdGgoJ2NhY2hlJyksJ3NmcGdtcicpO1xyXG52YXIgY2FjaGVQYXRoID0gcGF0aC5qb2luKGNhY2hlUm9vdCwnZ2lnYWNhcHN1bGUnKTtcclxudmFyIGdpZ2FDYXBzdWxlID0gJyc7XHJcblxyXG5yZXF1aXJlKCdjcmFzaC1yZXBvcnRlcicpLnN0YXJ0KCk7XHJcblxyXG52YXIgbWFpbldpbmRvdyA9IG51bGw7XHJcblxyXG5hcHAub24oJ3dpbmRvdy1hbGwtY2xvc2VkJywgZnVuY3Rpb24oKSB7XHJcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT0gJ2RhcndpbicpXHJcbiAgICBhcHAucXVpdCgpO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGRlbm9kZWlmeShub2RlRnVuYyl7XHJcbiAgICB2YXIgYmFzZUFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBub2RlQXJncyA9IGJhc2VBcmdzLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBub2RlQXJncy5wdXNoKChlcnJvciwgZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbm9kZUZ1bmMuYXBwbHkobnVsbCwgbm9kZUFyZ3MpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuYXBwLm9uKCdyZWFkeScsIGZ1bmN0aW9uKCkge1xyXG4gIC8vIEdpZ2EgQ2Fwc3VsZSDjg4fjgqPjgrnjgq/jgpLjg4Hjgqfjg4Pjgq/jgZnjgotcclxuICAvLyBXaW5kb3dzIOOBruOBvy4uLlxyXG4gIHZhciBleGVjID0gZGVub2RlaWZ5KHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjKTtcclxuICBleGVjKCd3bWljIGxvZ2ljYWxkaXNrIGdldCBjYXB0aW9uJylcclxuICAudGhlbigoc3Rkb3V0LHN0ZGVycikgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCkgPT4ge1xyXG4gICAgICAgIHN0ZG91dC5zcGxpdCgvXFxyXFxyXFxuLykuZm9yRWFjaCgoZCk9PntcclxuICAgICAgICAgIGlmKGQubWF0Y2goL1xcOi8pKXtcclxuICAgICAgICAgICAgbGV0IGRyaXZlID0gZC50cmltKCk7XHJcbiAgICAgICAgICAgIGlmKGZzLmV4aXN0c1N5bmMoZHJpdmUgKyAnL1lNT0dJR0EuRVhFJykpe1xyXG4gICAgICAgICAgICAgIHJlc29sdmUoZHJpdmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmVqZWN0KCdHaWdhIENhcHN1bGUgRGlzayBOb3QgRm91bmQuJyk7XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC50aGVuKChkcml2ZSk9PntcclxuICAgIC8vIEdpZ2EgQ2Fwc3VsZeOBruODieODqeOCpOODluWIpOaYjlxyXG4gICAgZ2lnYUNhcHN1bGUgPSBwYXRoLmpvaW4oZHJpdmUsJy8nKTtcclxuICAgIC8vIOOCreODo+ODg+OCt+ODpeODh+OCo+ODrOOCr+ODiOODquS9nOaIkFxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGZzLm1rZGlyU3luYyhjYWNoZVJvb3QpO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgaWYoZS5jb2RlICE9PSAnRUVYSVNUJyl7XHJcbiAgICAgICAgICByZWplY3QoZS5kZXNjcmlwdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgZnMubWtkaXJTeW5jKGNhY2hlUGF0aCk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBpZihlLmNvZGUgIT09ICdFRVhJU1QnKXtcclxuICAgICAgICAgIHJlamVjdChlLmRlc2NyaXB0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuICAudGhlbigoKT0+e1xyXG4gICAgLy8g44OW44Op44Km44K2KENocm9taXVtKeOBrui1t+WLlSwg5Yid5pyf55S76Z2i44Gu44Ot44O844OJXHJcbiAgICBtYWluV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe3dpZHRoOiA4MDAsIGhlaWdodDogNjAwfSk7XHJcbiAgICBtYWluV2luZG93LmxvYWRVcmwoJ2ZpbGU6Ly8nICsgX19kaXJuYW1lICsgJy8uLi9pbmRleC5odG1sJyk7XHJcbiAgICBtYWluV2luZG93Lm9uKCdjbG9zZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgbWFpbldpbmRvdyA9IG51bGw7XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC5jYXRjaCgoZSk9PntcclxuICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gIH0pO1xyXG4gIC8vYXBwLnF1aXQoKTtcclxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
