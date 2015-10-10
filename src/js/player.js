'use strict';

import denodeify from './denodeify';
import ipc from 'ipc';
ipc.setMaxListeners(0);
import * as fs from 'fs';
import * as path  from 'path';
import makedir from './makedir';
var access = denodeify(fs.access);
import { exec  as exec_ } from 'child_process';
var exec = denodeify(exec_);

class Player {
	constructor(gigaCapsulePath,cachePath,workPath){
		this.gigaCapsulePath = gigaCapsulePath;
		this.cachePath = cachePath;
		this.workPath = workPath;
		this.count = 0;
		this.playPromises = null;
		this.cachePromises = null;
		this.cacheMakers = {
			'.MOV' : this.makeVideoCache.bind(this),
			'.AIF' : this.makeAudioCache.bind(this)
		};
	}
	
	// 動画ファイルのキャッシュ生成
	makeVideoCache(pathFlagment,targetExt,option){
		targetExt = targetExt || '.ogv';
		option = option || '-qscale:v 10 -qscale:a 10 -codec:v libtheora';
		var pathSrc = path.join(this.gigaCapsulePath,pathFlagment);
		var ext = path.extname(pathFlagment);
		var pathDest = path.join(this.cachePath,path.basename(pathFlagment.replace(/\//ig,'_'),ext) + targetExt);
		return this.makeCache(pathSrc,pathDest,option);
	}

	// オーディオファイルのキャッシュ生成
	makeAudioCache(pathFlagment,targetExt,option){
		targetExt = targetExt || '.opus';
		var pathSrc = path.join(this.gigaCapsulePath,pathFlagment);
		var ext = path.extname(pathFlagment);
		var pathDest = path.join(this.cachePath,path.basename(pathFlagment.replace(/\//ig,'_'),ext) + targetExt);
		return this.makeCache(pathSrc,pathDest,option);
	}

	makeCacheAndPlay (window,path_,targetExt,option) {
		this.count++;
		var ext = path.extname(path_).toUpperCase();
		var this_ = this;
		return this.cacheMakers[ext](path_,targetExt,option)
			.then((pathDest)=>{
				console.log(pathDest);
				var p = this.playVideo_.bind(this,window,pathDest);
				if(this.playPromises){
					this.playPromises = this.playPromises
					.then(p)
					.then(()=>{this_.count--;});
				} else {
					this.playPromises = p().then(()=>{this_.count--;});
				}
			});			
	}

	prepareCache(path_,targetExt,option){
		var ext = path.extname(path_).toUpperCase();
		return this.cacheMakers[ext](path_,targetExt,option);
	}
	
	play(window,path_){
		// Promiseのチェインを2つ（キャッシュチェイン、再生チェイン）作る
		// 再生中に後続のデータのキャッシュを作れるようにするため

		// キャッシュのチェイン
		// 先行のキャッシュ生成が終わったらキャッシュ生成をシーケンシャルに行う
		if(this.cachePromises){
			this.cachePromises = this.cachePromises.then(()=>{
				// 再生のチェイン
				// 先行の再生完了 -> キャッシュの生成終了まち -> 再生をシーケンシャルに行う
				//console.log(p);
				return this.makeCacheAndPlay(window,path_);
			});
		} else {
			this.cachePromises = this.makeCacheAndPlay(window,path_);
		}		
	}
	
	isPlaying(){
		return this.counter !== 0 ;
	}

	// playEnd(){
	// 	this.cachePromises.then((p)=>{
	// 		// 再生のチェイン
	// 		// 先行の再生完了 -> キャッシュの生成終了まち -> 再生をシーケンシャルに行う
	// 		if(p){
	// 			this.playPromises = this.playPromises.then(p);
	// 		}
	// 	});		
	// }

	// コンテンツを再生可能な形式に変換し、キャッシュする
	makeCache(src,dest,option)
	{
//		console.log(process.cwd());
		option = option || '';
		return access(dest,fs.F_OK)
		.then(()=>Promise.resolve(dest),// resolve
		()=>{// reject
			// 作業中のファイルはテンポラリに保存
			var tmpPath = path.join(this.workPath,path.basename(dest));
			// ffmpegでファイル変換
			return exec(process.cwd() + '/ffmpeg/ffmpeg.exe -y -loglevel fatal -i ' + src + ' ' + option + ' ' + tmpPath)
			// 変換からテンポラリから移動
			.then(exec.bind(null,'cmd /c move /Y ' + tmpPath + ' ' + dest),(e)=>{console.log(e);})
			// 変換後のファイル名を返す
			.then(()=>Promise.resolve(dest));
		}
		);
	}

	// ビデオの再生
	playVideo_(window,path) {
		return new Promise((resolve, reject) => {
			window.webContents.send('playVideo', path);
			ipc.once('playVideoEnd', function () {
				resolve();
				console.log(path);
			});
		});
	}
	
	// オーディオの再生
	playAudio_(window,path) {
		return new Promise((resolve, reject) => {
			window.webContents.send('playAudio', path);
			ipc.once('playAudioEnd', function () {
				resolve();
				console.log(path);
			});
		});
	}
	
	// Promise チェインのクリア
	clear(){
		this.playPromises = null;
		this.cachePromises = null;
	}	
	
	wait(){
		var this_ = this;
		return new Promise((resolve,reject)=>{
		setTimeout(function wait (){
			console.log(this_.count);
			if(this_.count){
				setTimeout(wait,500);
			} else {
				resolve();
			}
		},500);
		});
	}
};

export default Player;
