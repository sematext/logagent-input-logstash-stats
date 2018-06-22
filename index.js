'use strict'
var rest = require('restler')
var urls = ['/_node/stats']
var flat = require('flat')
/**
 * Constructor called by logagent, when the config file contains this entry:
 * input
 *  logstashStats:
 *    module: logagent-input-logstash-stats
 *    url: http://localhost:9600
 *
 * @config cli arguments and config.configFile entries
 * @eventEmitter logent eventEmitter object
 */
function LogstashStats (config, eventEmitter) {
  this.config = config.configFile.input.logstashStats
  this.config.url = config.configFile.input.logstashStats.url
  this.eventEmitter = eventEmitter
  if (config.hotThreads) {
    urls.push('/_node/hot_threads');
  }
}

/**
 * Plugin start function, called after constructor
 *
 */
LogstashStats.prototype.start = function () {
  this.started = true
  var self = this
  this.tid = setInterval(function () {
    for (var i = 0; i < urls.length; i++) {
      var context = {sourceName: 'logstashStats', url: self.config.url + urls[i]}
      self.queryStats(context.url, context)
    }
  }, 10000)
}

/**
 * Plugin stop function, called when logagent terminates
 * we close the server socket here.
 */
LogstashStats.prototype.stop = function (cb) {
  clearInterval(this.tid)
}

LogstashStats.prototype.emitData = function (data, context) {
  if (this.config.debug) {
    console.log('#############################')
    console.log('context: ', context)
    console.log('#############################')
    console.log(JSON.stringify(flat.flatten(data), null, '\t'))
  }
  this.eventEmitter.emit('data.raw', JSON.stringify(flat.flatten(data)), context)
}


LogstashStats.prototype.queryStats = function (url, context) {
  var self = this
  rest.get(url).on('complete', function (result) {
    if (result instanceof Error) {
      console.error('Error (' + url + '): ', result)
    } else {
      self.emitData(result, context)
    }
  })
}

module.exports = LogstashStats
