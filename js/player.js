'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _denodeify = require('./denodeify');

var _denodeify2 = _interopRequireDefault(_denodeify);

var _ipc = require('ipc');

var _ipc2 = _interopRequireDefault(_ipc);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _makedir = require('./makedir');

var _makedir2 = _interopRequireDefault(_makedir);

var _child_process = require('child_process');

_ipc2['default'].setMaxListeners(0);

var access = (0, _denodeify2['default'])(fs.access);

var exec = (0, _denodeify2['default'])(_child_process.exec);

var Player = (function () {
	function Player(gigaCapsulePath, cachePath, workPath) {
		_classCallCheck(this, Player);

		this.gigaCapsulePath = gigaCapsulePath;
		this.cachePath = cachePath;
		this.workPath = workPath;
		this.count = 0;
		this.playPromises = null;
		this.cachePromises = null;
		this.cacheMakers = {
			'.MOV': this.makeVideoCache.bind(this),
			'.AIF': this.makeAudioCache.bind(this)
		};
	}

	// 動画ファイルのキャッシュ生成

	_createClass(Player, [{
		key: 'makeVideoCache',
		value: function makeVideoCache(pathFlagment, targetExt, option) {
			targetExt = targetExt || '.ogv';
			option = option || '-qscale:v 10 -qscale:a 10 -codec:v libtheora';
			var pathSrc = path.join(this.gigaCapsulePath, pathFlagment);
			var ext = path.extname(pathFlagment);
			var pathDest = path.join(this.cachePath, path.basename(pathFlagment.replace(/\//ig, '_'), ext) + targetExt);
			return this.makeCache(pathSrc, pathDest, option);
		}

		// オーディオファイルのキャッシュ生成
	}, {
		key: 'makeAudioCache',
		value: function makeAudioCache(pathFlagment, targetExt, option) {
			targetExt = targetExt || '.opus';
			var pathSrc = path.join(this.gigaCapsulePath, pathFlagment);
			var ext = path.extname(pathFlagment);
			var pathDest = path.join(this.cachePath, path.basename(pathFlagment.replace(/\//ig, '_'), ext) + targetExt);
			return this.makeCache(pathSrc, pathDest, option);
		}
	}, {
		key: 'makeCacheAndPlay',
		value: function makeCacheAndPlay(window, path_, targetExt, option) {
			var _this = this;

			this.count++;
			var ext = path.extname(path_).toUpperCase();
			var this_ = this;
			return this.cacheMakers[ext](path_, targetExt, option).then(function (pathDest) {
				console.log(pathDest);
				var p = _this.playVideo_.bind(_this, window, pathDest);
				if (_this.playPromises) {
					_this.playPromises = _this.playPromises.then(p).then(function () {
						this_.count--;
					});
				} else {
					_this.playPromises = p().then(function () {
						this_.count--;
					});
				}
			});
		}
	}, {
		key: 'prepareCache',
		value: function prepareCache(path_, targetExt, option) {
			var ext = path.extname(path_).toUpperCase();
			return this.cacheMakers[ext](path_, targetExt, option);
		}
	}, {
		key: 'play',
		value: function play(window, path_) {
			var _this2 = this;

			// Promiseのチェインを2つ（キャッシュチェイン、再生チェイン）作る
			// 再生中に後続のデータのキャッシュを作れるようにするため

			// キャッシュのチェイン
			// 先行のキャッシュ生成が終わったらキャッシュ生成をシーケンシャルに行う
			if (this.cachePromises) {
				this.cachePromises = this.cachePromises.then(function () {
					// 再生のチェイン
					// 先行の再生完了 -> キャッシュの生成終了まち -> 再生をシーケンシャルに行う
					//console.log(p);
					return _this2.makeCacheAndPlay(window, path_);
				});
			} else {
				this.cachePromises = this.makeCacheAndPlay(window, path_);
			}
		}
	}, {
		key: 'isPlaying',
		value: function isPlaying() {
			return this.counter !== 0;
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
	}, {
		key: 'makeCache',
		value: function makeCache(src, dest, option) {
			var _this3 = this;

			//		console.log(process.cwd());
			option = option || '';
			return access(dest, fs.F_OK).then(function () {
				return Promise.resolve(dest);
			}, // resolve
			function () {
				// reject
				// 作業中のファイルはテンポラリに保存
				var tmpPath = path.join(_this3.workPath, path.basename(dest));
				// ffmpegでファイル変換
				return exec(process.cwd() + '/ffmpeg/ffmpeg.exe -y -loglevel fatal -i ' + src + ' ' + option + ' ' + tmpPath)
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
	}, {
		key: 'playVideo_',
		value: function playVideo_(window, path) {
			return new Promise(function (resolve, reject) {
				window.webContents.send('playVideo', path);
				_ipc2['default'].once('playVideoEnd', function () {
					resolve();
					console.log(path);
				});
			});
		}

		// オーディオの再生
	}, {
		key: 'playAudio_',
		value: function playAudio_(window, path) {
			return new Promise(function (resolve, reject) {
				window.webContents.send('playAudio', path);
				_ipc2['default'].once('playAudioEnd', function () {
					resolve();
					console.log(path);
				});
			});
		}

		// Promise チェインのクリア
	}, {
		key: 'clear',
		value: function clear() {
			this.playPromises = null;
			this.cachePromises = null;
		}
	}, {
		key: 'wait',
		value: function wait() {
			var this_ = this;
			return new Promise(function (resolve, reject) {
				setTimeout(function wait() {
					console.log(this_.count);
					if (this_.count) {
						setTimeout(wait, 500);
					} else {
						resolve();
					}
				}, 500);
			});
		}
	}]);

	return Player;
})();

;

exports['default'] = Player;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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ckIsTUFBTTtBQUNOLGFBQU8sRUFBRSxDQUFDO01BQ1Y7S0FDRCxFQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDO0dBQ0g7OztRQXBKSSxNQUFNOzs7QUFxSlgsQ0FBQzs7cUJBRWEsTUFBTSIsImZpbGUiOiJwbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgZGVub2RlaWZ5IGZyb20gJy4vZGVub2RlaWZ5JztcclxuaW1wb3J0IGlwYyBmcm9tICdpcGMnO1xyXG5pcGMuc2V0TWF4TGlzdGVuZXJzKDApO1xyXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCAqIGFzIHBhdGggIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgbWFrZWRpciBmcm9tICcuL21ha2VkaXInO1xyXG52YXIgYWNjZXNzID0gZGVub2RlaWZ5KGZzLmFjY2Vzcyk7XHJcbmltcG9ydCB7IGV4ZWMgIGFzIGV4ZWNfIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XHJcbnZhciBleGVjID0gZGVub2RlaWZ5KGV4ZWNfKTtcclxuXHJcbmNsYXNzIFBsYXllciB7XHJcblx0Y29uc3RydWN0b3IoZ2lnYUNhcHN1bGVQYXRoLGNhY2hlUGF0aCx3b3JrUGF0aCl7XHJcblx0XHR0aGlzLmdpZ2FDYXBzdWxlUGF0aCA9IGdpZ2FDYXBzdWxlUGF0aDtcclxuXHRcdHRoaXMuY2FjaGVQYXRoID0gY2FjaGVQYXRoO1xyXG5cdFx0dGhpcy53b3JrUGF0aCA9IHdvcmtQYXRoO1xyXG5cdFx0dGhpcy5jb3VudCA9IDA7XHJcblx0XHR0aGlzLnBsYXlQcm9taXNlcyA9IG51bGw7XHJcblx0XHR0aGlzLmNhY2hlUHJvbWlzZXMgPSBudWxsO1xyXG5cdFx0dGhpcy5jYWNoZU1ha2VycyA9IHtcclxuXHRcdFx0Jy5NT1YnIDogdGhpcy5tYWtlVmlkZW9DYWNoZS5iaW5kKHRoaXMpLFxyXG5cdFx0XHQnLkFJRicgOiB0aGlzLm1ha2VBdWRpb0NhY2hlLmJpbmQodGhpcylcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdC8vIOWLleeUu+ODleOCoeOCpOODq+OBruOCreODo+ODg+OCt+ODpeeUn+aIkFxyXG5cdG1ha2VWaWRlb0NhY2hlKHBhdGhGbGFnbWVudCx0YXJnZXRFeHQsb3B0aW9uKXtcclxuXHRcdHRhcmdldEV4dCA9IHRhcmdldEV4dCB8fCAnLm9ndic7XHJcblx0XHRvcHRpb24gPSBvcHRpb24gfHwgJy1xc2NhbGU6diAxMCAtcXNjYWxlOmEgMTAgLWNvZGVjOnYgbGlidGhlb3JhJztcclxuXHRcdHZhciBwYXRoU3JjID0gcGF0aC5qb2luKHRoaXMuZ2lnYUNhcHN1bGVQYXRoLHBhdGhGbGFnbWVudCk7XHJcblx0XHR2YXIgZXh0ID0gcGF0aC5leHRuYW1lKHBhdGhGbGFnbWVudCk7XHJcblx0XHR2YXIgcGF0aERlc3QgPSBwYXRoLmpvaW4odGhpcy5jYWNoZVBhdGgscGF0aC5iYXNlbmFtZShwYXRoRmxhZ21lbnQucmVwbGFjZSgvXFwvL2lnLCdfJyksZXh0KSArIHRhcmdldEV4dCk7XHJcblx0XHRyZXR1cm4gdGhpcy5tYWtlQ2FjaGUocGF0aFNyYyxwYXRoRGVzdCxvcHRpb24pO1xyXG5cdH1cclxuXHJcblx0Ly8g44Kq44O844OH44Kj44Kq44OV44Kh44Kk44Or44Gu44Kt44Oj44OD44K344Ol55Sf5oiQXHJcblx0bWFrZUF1ZGlvQ2FjaGUocGF0aEZsYWdtZW50LHRhcmdldEV4dCxvcHRpb24pe1xyXG5cdFx0dGFyZ2V0RXh0ID0gdGFyZ2V0RXh0IHx8ICcub3B1cyc7XHJcblx0XHR2YXIgcGF0aFNyYyA9IHBhdGguam9pbih0aGlzLmdpZ2FDYXBzdWxlUGF0aCxwYXRoRmxhZ21lbnQpO1xyXG5cdFx0dmFyIGV4dCA9IHBhdGguZXh0bmFtZShwYXRoRmxhZ21lbnQpO1xyXG5cdFx0dmFyIHBhdGhEZXN0ID0gcGF0aC5qb2luKHRoaXMuY2FjaGVQYXRoLHBhdGguYmFzZW5hbWUocGF0aEZsYWdtZW50LnJlcGxhY2UoL1xcLy9pZywnXycpLGV4dCkgKyB0YXJnZXRFeHQpO1xyXG5cdFx0cmV0dXJuIHRoaXMubWFrZUNhY2hlKHBhdGhTcmMscGF0aERlc3Qsb3B0aW9uKTtcclxuXHR9XHJcblxyXG5cdG1ha2VDYWNoZUFuZFBsYXkgKHdpbmRvdyxwYXRoXyx0YXJnZXRFeHQsb3B0aW9uKSB7XHJcblx0XHR0aGlzLmNvdW50Kys7XHJcblx0XHR2YXIgZXh0ID0gcGF0aC5leHRuYW1lKHBhdGhfKS50b1VwcGVyQ2FzZSgpO1xyXG5cdFx0dmFyIHRoaXNfID0gdGhpcztcclxuXHRcdHJldHVybiB0aGlzLmNhY2hlTWFrZXJzW2V4dF0ocGF0aF8sdGFyZ2V0RXh0LG9wdGlvbilcclxuXHRcdFx0LnRoZW4oKHBhdGhEZXN0KT0+e1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHBhdGhEZXN0KTtcclxuXHRcdFx0XHR2YXIgcCA9IHRoaXMucGxheVZpZGVvXy5iaW5kKHRoaXMsd2luZG93LHBhdGhEZXN0KTtcclxuXHRcdFx0XHRpZih0aGlzLnBsYXlQcm9taXNlcyl7XHJcblx0XHRcdFx0XHR0aGlzLnBsYXlQcm9taXNlcyA9IHRoaXMucGxheVByb21pc2VzXHJcblx0XHRcdFx0XHQudGhlbihwKVxyXG5cdFx0XHRcdFx0LnRoZW4oKCk9Pnt0aGlzXy5jb3VudC0tO30pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLnBsYXlQcm9taXNlcyA9IHAoKS50aGVuKCgpPT57dGhpc18uY291bnQtLTt9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1x0XHRcdFxyXG5cdH1cclxuXHJcblx0cHJlcGFyZUNhY2hlKHBhdGhfLHRhcmdldEV4dCxvcHRpb24pe1xyXG5cdFx0dmFyIGV4dCA9IHBhdGguZXh0bmFtZShwYXRoXykudG9VcHBlckNhc2UoKTtcclxuXHRcdHJldHVybiB0aGlzLmNhY2hlTWFrZXJzW2V4dF0ocGF0aF8sdGFyZ2V0RXh0LG9wdGlvbik7XHJcblx0fVxyXG5cdFxyXG5cdHBsYXkod2luZG93LHBhdGhfKXtcclxuXHRcdC8vIFByb21pc2Xjga7jg4HjgqfjgqTjg7PjgpIy44Gk77yI44Kt44Oj44OD44K344Ol44OB44Kn44Kk44Oz44CB5YaN55Sf44OB44Kn44Kk44Oz77yJ5L2c44KLXHJcblx0XHQvLyDlho3nlJ/kuK3jgavlvozntprjga7jg4fjg7zjgr/jga7jgq3jg6Pjg4Pjgrfjg6XjgpLkvZzjgozjgovjgojjgYbjgavjgZnjgovjgZ/jgoFcclxuXHJcblx0XHQvLyDjgq3jg6Pjg4Pjgrfjg6Xjga7jg4HjgqfjgqTjg7NcclxuXHRcdC8vIOWFiOihjOOBruOCreODo+ODg+OCt+ODpeeUn+aIkOOBjOe1guOCj+OBo+OBn+OCieOCreODo+ODg+OCt+ODpeeUn+aIkOOCkuOCt+ODvOOCseODs+OCt+ODo+ODq+OBq+ihjOOBhlxyXG5cdFx0aWYodGhpcy5jYWNoZVByb21pc2VzKXtcclxuXHRcdFx0dGhpcy5jYWNoZVByb21pc2VzID0gdGhpcy5jYWNoZVByb21pc2VzLnRoZW4oKCk9PntcclxuXHRcdFx0XHQvLyDlho3nlJ/jga7jg4HjgqfjgqTjg7NcclxuXHRcdFx0XHQvLyDlhYjooYzjga7lho3nlJ/lrozkuoYgLT4g44Kt44Oj44OD44K344Ol44Gu55Sf5oiQ57WC5LqG44G+44GhIC0+IOWGjeeUn+OCkuOCt+ODvOOCseODs+OCt+ODo+ODq+OBq+ihjOOBhlxyXG5cdFx0XHRcdC8vY29uc29sZS5sb2cocCk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMubWFrZUNhY2hlQW5kUGxheSh3aW5kb3cscGF0aF8pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuY2FjaGVQcm9taXNlcyA9IHRoaXMubWFrZUNhY2hlQW5kUGxheSh3aW5kb3cscGF0aF8pO1xyXG5cdFx0fVx0XHRcclxuXHR9XHJcblx0XHJcblx0aXNQbGF5aW5nKCl7XHJcblx0XHRyZXR1cm4gdGhpcy5jb3VudGVyICE9PSAwIDtcclxuXHR9XHJcblxyXG5cdC8vIHBsYXlFbmQoKXtcclxuXHQvLyBcdHRoaXMuY2FjaGVQcm9taXNlcy50aGVuKChwKT0+e1xyXG5cdC8vIFx0XHQvLyDlho3nlJ/jga7jg4HjgqfjgqTjg7NcclxuXHQvLyBcdFx0Ly8g5YWI6KGM44Gu5YaN55Sf5a6M5LqGIC0+IOOCreODo+ODg+OCt+ODpeOBrueUn+aIkOe1guS6huOBvuOBoSAtPiDlho3nlJ/jgpLjgrfjg7zjgrHjg7Pjgrfjg6Pjg6vjgavooYzjgYZcclxuXHQvLyBcdFx0aWYocCl7XHJcblx0Ly8gXHRcdFx0dGhpcy5wbGF5UHJvbWlzZXMgPSB0aGlzLnBsYXlQcm9taXNlcy50aGVuKHApO1xyXG5cdC8vIFx0XHR9XHJcblx0Ly8gXHR9KTtcdFx0XHJcblx0Ly8gfVxyXG5cclxuXHQvLyDjgrPjg7Pjg4bjg7Pjg4TjgpLlho3nlJ/lj6/og73jgarlvaLlvI/jgavlpInmj5vjgZfjgIHjgq3jg6Pjg4Pjgrfjg6XjgZnjgotcclxuXHRtYWtlQ2FjaGUoc3JjLGRlc3Qsb3B0aW9uKVxyXG5cdHtcclxuLy9cdFx0Y29uc29sZS5sb2cocHJvY2Vzcy5jd2QoKSk7XHJcblx0XHRvcHRpb24gPSBvcHRpb24gfHwgJyc7XHJcblx0XHRyZXR1cm4gYWNjZXNzKGRlc3QsZnMuRl9PSylcclxuXHRcdC50aGVuKCgpPT5Qcm9taXNlLnJlc29sdmUoZGVzdCksLy8gcmVzb2x2ZVxyXG5cdFx0KCk9PnsvLyByZWplY3RcclxuXHRcdFx0Ly8g5L2c5qWt5Lit44Gu44OV44Kh44Kk44Or44Gv44OG44Oz44Od44Op44Oq44Gr5L+d5a2YXHJcblx0XHRcdHZhciB0bXBQYXRoID0gcGF0aC5qb2luKHRoaXMud29ya1BhdGgscGF0aC5iYXNlbmFtZShkZXN0KSk7XHJcblx0XHRcdC8vIGZmbXBlZ+OBp+ODleOCoeOCpOODq+WkieaPm1xyXG5cdFx0XHRyZXR1cm4gZXhlYyhwcm9jZXNzLmN3ZCgpICsgJy9mZm1wZWcvZmZtcGVnLmV4ZSAteSAtbG9nbGV2ZWwgZmF0YWwgLWkgJyArIHNyYyArICcgJyArIG9wdGlvbiArICcgJyArIHRtcFBhdGgpXHJcblx0XHRcdC8vIOWkieaPm+OBi+OCieODhuODs+ODneODqeODquOBi+OCieenu+WLlVxyXG5cdFx0XHQudGhlbihleGVjLmJpbmQobnVsbCwnY21kIC9jIG1vdmUgL1kgJyArIHRtcFBhdGggKyAnICcgKyBkZXN0KSwoZSk9Pntjb25zb2xlLmxvZyhlKTt9KVxyXG5cdFx0XHQvLyDlpInmj5vlvozjga7jg5XjgqHjgqTjg6vlkI3jgpLov5TjgZlcclxuXHRcdFx0LnRoZW4oKCk9PlByb21pc2UucmVzb2x2ZShkZXN0KSk7XHJcblx0XHR9XHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0Ly8g44OT44OH44Kq44Gu5YaN55SfXHJcblx0cGxheVZpZGVvXyh3aW5kb3cscGF0aCkge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0d2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ3BsYXlWaWRlbycsIHBhdGgpO1xyXG5cdFx0XHRpcGMub25jZSgncGxheVZpZGVvRW5kJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHJlc29sdmUoKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhwYXRoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0XHJcblx0Ly8g44Kq44O844OH44Kj44Kq44Gu5YaN55SfXHJcblx0cGxheUF1ZGlvXyh3aW5kb3cscGF0aCkge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0d2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ3BsYXlBdWRpbycsIHBhdGgpO1xyXG5cdFx0XHRpcGMub25jZSgncGxheUF1ZGlvRW5kJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHJlc29sdmUoKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhwYXRoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0XHJcblx0Ly8gUHJvbWlzZSDjg4HjgqfjgqTjg7Pjga7jgq/jg6rjgqJcclxuXHRjbGVhcigpe1xyXG5cdFx0dGhpcy5wbGF5UHJvbWlzZXMgPSBudWxsO1xyXG5cdFx0dGhpcy5jYWNoZVByb21pc2VzID0gbnVsbDtcclxuXHR9XHRcclxuXHRcclxuXHR3YWl0KCl7XHJcblx0XHR2YXIgdGhpc18gPSB0aGlzO1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCk9PntcclxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gd2FpdCAoKXtcclxuXHRcdFx0Y29uc29sZS5sb2codGhpc18uY291bnQpO1xyXG5cdFx0XHRpZih0aGlzXy5jb3VudCl7XHJcblx0XHRcdFx0c2V0VGltZW91dCh3YWl0LDUwMCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmVzb2x2ZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9LDUwMCk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
