# logagent-input-logstash-stats

Plugin to collect Logstash stats. It uses the node stats API and optionally the hot threads API.

## Install logagent 2.x 

  ```
  npm i -g @sematext/logagent
  ```

## Install logagent-input-logstash-stats plugin 

  ```
  npm i -g logagent-input-logstash-stats  
  ```

## Configure logagent 

  ```
  input:
    logstashStats:
      module: logagent-input-logstash-stats 
      url: 'http://localhost:9600'
      hotThreads: false
      debug: false

  output:
    logstash:
      url: http://localhost:9200
      index: logstash-metrics

  # global options
  options:
    includeOriginalLine: false
    printStats: 60

  ```

## Start logagent

  ```
  logagent --config myconfig.yml
  ```


