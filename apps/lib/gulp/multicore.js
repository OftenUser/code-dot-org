/**
 * Multicore transform stream processing
 */
var parallel = require('parallel-transform');
var master = require('slave/master');
var temp = require('temp');

module.exports = function (moduleName, options) {
  options = options || {};

  var format = null;
  var concurrency = options.concurrency || require('os').cpus().length;

  function process(data, callback) {
    var inputData = data;
    if(typeof options.input == 'function') {
      inputData = options.input(data);
    }
    if (!format) {
      var tempFile = temp.openSync();
      var fs = require('fs');
      fs.writeSync(tempFile.fd, "require('" + __dirname + "/../../node_modules/slave/slave')(require('" + require.resolve(moduleName) + "'));");
      format = master(require.resolve(tempFile.path));
      for (var i = 0; i < concurrency; i++) {
        format.fork();
      }
    }
    format(inputData).then(function (outputData) {
      if(typeof options.output == 'function') {
        outputData = options.output(data, inputData, outputData);
      }
      return callback(null, outputData);
    });
  }

  var stream = parallel(options.maxParallel || 20, process);
  stream.on('end', function () {
    if (format) {
      format.all({file: null}).then(function() {
        //console.log('format all finished');
        format.kill();
        format = null;
      });
    }
  });
  return stream;
};
