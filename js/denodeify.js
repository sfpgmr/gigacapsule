'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
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
};

exports['default'] = denodeify;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlbm9kZWlmeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7QUFDYixTQUFTLFNBQVMsQ0FBRSxRQUFRLEVBQUM7QUFDekIsUUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4RCxXQUFPLFlBQVc7OztBQUNkLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFDdEUsZUFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDcEMsb0JBQVEsQ0FBQyxJQUFJLENBQUMsVUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFLO0FBQzNCLG9CQUFJLEtBQUssRUFBRTtBQUNQLDBCQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ2pCLE1BQU0sSUFBSSxXQUFVLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDN0IsMkJBQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLGFBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDckQsTUFBTTtBQUNILDJCQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2pCO2FBQ0osQ0FBQyxDQUFDO0FBQ0gsb0JBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ2xDLENBQUMsQ0FBQztLQUNOLENBQUE7Q0FDSixDQUFDOztxQkFFYSxTQUFTIiwiZmlsZSI6ImRlbm9kZWlmeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuZnVuY3Rpb24gZGVub2RlaWZ5IChub2RlRnVuYyl7XHJcbiAgICB2YXIgYmFzZUFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBub2RlQXJncyA9IGJhc2VBcmdzLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBub2RlQXJncy5wdXNoKChlcnJvciwgZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbm9kZUZ1bmMuYXBwbHkobnVsbCwgbm9kZUFyZ3MpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVub2RlaWZ5OyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
