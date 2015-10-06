'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _denodeify = require('./denodeify');

var _denodeify2 = _interopRequireDefault(_denodeify);

var mkdir = (0, _denodeify2['default'])(fs.mkdir);
function makedir(path) {
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

exports['default'] = makedir;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ha2VkaXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7O2tCQUVTLElBQUk7O0lBQWIsRUFBRTs7eUJBQ1EsYUFBYTs7OztBQUNuQyxJQUFJLEtBQUssR0FBRyw0QkFBVSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEMsU0FBUyxPQUFPLENBQUMsSUFBSSxFQUFDO0FBQ3JCLFFBQU8sWUFBSTtBQUNWLFNBQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUNqQixJQUFJLENBQUM7VUFBSyxPQUFPLENBQUMsT0FBTyxFQUFFO0dBQUEsRUFDNUIsVUFBQyxDQUFDLEVBQUk7QUFDTCxPQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFDO0FBQ3ZCLFdBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakI7QUFDRCxVQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUN6QixDQUFDLENBQUM7RUFDSCxDQUFBO0NBQ0Q7O3FCQUVhLE9BQU8iLCJmaWxlIjoibWFrZWRpci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcblx0aW1wb3J0ICogYXMgZnMgIGZyb20gJ2ZzJztcclxuXHRpbXBvcnQgZGVub2RlaWZ5IGZyb20gJy4vZGVub2RlaWZ5JztcclxuXHR2YXIgbWtkaXIgPSBkZW5vZGVpZnkoZnMubWtkaXIpO1xyXG5cdGZ1bmN0aW9uIG1ha2VkaXIocGF0aCl7XHJcblx0XHRyZXR1cm4gKCk9PntcclxuXHRcdFx0cmV0dXJuIG1rZGlyKHBhdGgpXHJcblx0XHRcdC50aGVuKCgpPT4gUHJvbWlzZS5yZXNvbHZlKCksXHJcblx0XHRcdChlKSA9PntcclxuXHRcdFx0XHRpZihlLmNvZGUgIT09ICdFRVhJU1QnKXtcclxuXHRcdFx0XHRQcm9taXNlLnJlamVjdChlKTtcclxuXHRcdFx0XHR9IFxyXG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9ICBcclxuXHR9XHJcblx0XHJcbmV4cG9ydCBkZWZhdWx0IG1ha2VkaXI7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
