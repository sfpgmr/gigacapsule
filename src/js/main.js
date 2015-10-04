'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var fs = require('fs');
var path = require('path');
var ffmpeg = require('basicFFmpeg');
var cacheRoot = path.join(app.getPath('cache'),'sfpgmr');
var cachePath = path.join(cacheRoot,'gigacapsule');
var workPath = path.join(cachePath,'work');
var gigaCapsule = '';
var mkdir = denodeify(fs.mkdir);
var access = denodeify(fs.access);
var exec = denodeify(require('child_process').exec);
var playPromises = Promise.resolve(0);
var cachePromises = Promise.resolve(0);

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

function denodeify(nodeFunc){
    var baseArgs = Array.prototype.slice.call(arguments, 1);
    return function() {
        var nodeArgs = baseArgs.concat(Array.prototype.slice.call(arguments));
        return new Promise((resolve, reject) => {
            nodeArgs.push((error, data) => {
                if (error) {
                    reject(error);
                } else if (arguments.length > 2) {
                    resolve(Array.prototype.slice.call(arguments, 1));
                } else {
                    resolve(data);
                }
            });
            nodeFunc.apply(null, nodeArgs);
        });
    }
}


app.on('ready', function() {
  // Giga Capsule ディスクをチェックする
  // Windows のみ...
  exec('wmic logicaldisk get caption')
  .then((stdout,stderr) => {
    return new Promise((resolve,reject) => {
        stdout.split(/\r\r\n/).forEach((d)=>{
          if(d.match(/\:/)){
            let drive = d.trim();
            if(fs.existsSync(drive + '/YMOGIGA.EXE')){
              resolve(drive);
            }
          }
        });
        reject('Giga Capsule Disk Not Found.');
    });
  })
  .then((drive)=>{
    // Giga Capsuleのドライブ判明
    gigaCapsule = path.join(drive,'/');
    console.log(gigaCapsule);
    // キャッシュディレクトリ作成
    return mkdir(cacheRoot);
  })
  .then(()=>{
    return mkdir(cachePath);
    },(e)=>{
      if(e.code !== 'EEXIST'){
        return Promise.reject(e);
      } else {
        return mkdir(cachePath);
      }
  })
  .then(()=> Promise.resolve(),
    (e)=>{
      if(e.code !== 'EEXIST'){
        Promise.reject(e);
      } 
      return Promise.resolve();
    }
  )
  .then(()=>{
    return mkdir(workPath)
    .then(()=> Promise.resolve(),
      (e) =>{
        if(e.code !== 'EEXIST'){
          Promise.reject(e);
        } 
        return Promise.resolve();
      });
  })
  .then(() => {
    return new Promise(function(resolve,reject){
    // ブラウザ(Chromium)の起動, 初期画面のロード
      mainWindow = new BrowserWindow(
        {
          'width': 1024,
          'height': 768,
          'use-content-size':true,
          'center':true,
          'auto-hide-menu-bar': true,
          'title':'YMO Giga Capusle Viewer',
          'web-preferences':{
            'direct-write': true
          }
        }
      );
      mainWindow.loadUrl('file://' + __dirname + '/../index.html');
      mainWindow.on('closed', function() {
        mainWindow = null;
      });
      mainWindow.webContents.on('did-finish-load', function() {
        resolve();
      });    
    });
  })
  // コンテンツの再生
  .then(()=>{
    playVideo('/MOVIE/QT/TITLE');
    playVideo('/MOVIE/QT/START_H'); 
    playAudio('/MOVIE/SOUND/OPENING');
    playAudio('/SAMPLING/03FIRECR/03_01');
    playAudio('/SAMPLING/03FIRECR/03_02');
    playAudio('/SAMPLING/03FIRECR/03_03');
    playAudio('/SAMPLING/03FIRECR/03_04');
    playAudio('/SAMPLING/03FIRECR/03_05');
    // playAudio('/MOVIE/L1/SOUNDS/4_1');
    // playAudio('/MOVIE/L1/SOUNDS/4_2');
    // playAudio('/MOVIE/L1/SOUNDS/4_3');
    // playAudio('/MOVIE/L1/SOUNDS/4_4');
    //playAudio('/MOVIE/L1/SOUNDS/4_5');
    // playAudio('/MOVIE/L1/SOUNDS/4_6');
    //playAudio('/MOVIE/L1/SOUNDS/4_7');
    //playAudio('/MOVIE/L1/SOUNDS/4_8');
    playAudio('/MOVIE/L1/SOUNDS/12_1');
    playAudio('/MOVIE/L1/SOUNDS/12_2');
    playAudio('/MOVIE/L1/SOUNDS/12_3');
    playAudio('/MOVIE/L1/SOUNDS/12_4');
    playAudio('/MOVIE/L1/SOUNDS/12_5');
    playAudio('/MOVIE/L1/SOUNDS/12_6');
    playAudio('/MOVIE/L1/SOUNDS/12_7');
    playAudio('/MOVIE/L1/SOUNDS/12_8');
    playAudio('/MOVIE/L1/SOUNDS/12_9');
    playAudio('/MOVIE/L1/SOUNDS/12_10');
    playAudio('/MOVIE/L1/SOUNDS/12_11');
    playAudio('/MOVIE/L1/SOUNDS/12_12');
    return playPromises;
  }).then(()=>{
    console.log('play end.');
    playPromises = Promise.resolve(0);
    cachePromises = Promise.resolve(0);
  })
  .catch((e)=>{
    var dialog = require('dialog');
    dialog.showErrorBox('Error',e);
//    console.log(e);
  });
  //app.quit();
});

// 動画ファイルのキャッシュ生成
function makeMovCache(pathFlagment){
  var pathSrc = path.join(gigaCapsule,pathFlagment + '.MOV');
  var pathDest = path.join(cachePath,pathFlagment.replace(/\//ig,'_') + '.mp4');
  return makeCache(pathSrc,pathDest);
}

// オーディオファイルのキャッシュ生成
function makeAudioCache(pathFlagment){
  var pathSrc = path.join(gigaCapsule,pathFlagment + '.AIF');
  var pathDest = path.join(cachePath,pathFlagment.replace(/\//ig,'_') + '.opus');
  return makeCache(pathSrc,pathDest);
}

// ビデオの再生
function playVideo(path)
{
  var cachePromise = makeMovCache(path);
  // Promiseのチェインを2つ（キャッシュチェイン、再生チェイン）作る
  // 再生中に後続のデータのキャッシュを作れるようにするため

  // キャッシュのチェイン
  // 先行のキャッシュ生成が終わったらキャッシュ生成をシーケンシャルに行う
  cachePromises = cachePromises.then(() => cachePromise);
  // 再生のチェイン
  // 先行の再生完了 -> キャッシュの生成終了まち -> 再生をシーケンシャルに行う
  playPromises = playPromises.then(() => cachePromise).then(playVideo_);

}

// オーディオの再生
function playAudio(path){
  var cachePromise = makeAudioCache(path);
  // Promiseのチェインを2つ（キャッシュチェイン、再生チェイン）作る
  // 再生中に後続のデータのキャッシュを作れるようにするため

  // キャッシュのチェイン
  // 先行のキャッシュ生成が終わったらキャッシュ生成をシーケンシャルに行う
  cachePromises = cachePromises.then(()=> cachePromise);
  // 再生のチェイン
  // 先行の再生完了 -> キャッシュの生成終了まち -> 再生をシーケンシャルに行う
  playPromises = playPromises.then(() => cachePromise).then(playAudio_);
}

// コンテンツを再生可能な形式に変換し、キャッシュする
function makeCache(src,dest,option)
{
    option = option || '';
    return access(dest,fs.F_OK)
    .then(()=> Promise.resolve(dest),// resolve
      ()=>{// reject
        // 作業中のファイルはテンポラリに保存
        var tmpPath = path.join(workPath,path.basename(dest));
        console.log(src,tmpPath);
        // ffmpegでファイル変換
        return exec('ffmpeg.exe -y -loglevel fatal -i ' + src + ' ' + option + ' ' + tmpPath)
          // 変換からテンポラリから移動
          .then(exec.bind(null,'cmd /c move /Y ' + tmpPath + ' ' + dest),(e)=>{console.log(e);})
          // 変換後のファイル名を返す
          .then(()=>Promise.resolve(dest));
      }
    );
}

// ビデオの再生
function playVideo_(path){
  return new Promise((resolve,reject)=>{
    mainWindow.webContents.send('playVideo',path);
    ipc.on('playVideoEnd',function(){
      resolve();
      console.log(path);
    });
  });
}

// オーディオの再生
function playAudio_(path){
  return new Promise((resolve,reject)=>{
    mainWindow.webContents.send('playAudio',path);
    ipc.on('playAudioEnd',function(){
      resolve();
      console.log(path);
    });
  });
}

