#!/usr/bin/env node
var dpws = require('dpws')
  , async = require('async')

var argv = require('optimist')
  .alias('a', 'address')
  .describe('address', 'address of DPWS Device')
  .alias('o', 'operation')
  .describe('operation', 'operation to invoke')
  .describe('n', 'number of times to call operation')
  .alias('c', 'concurrency')
  .describe('c', 'number of concurrent invokcations')
  .default('n', 5)
  .argv

if (argv._.length !== 1) {
  console.error('give one command of "search"')
}

var client = dpws.createClient()

var command = argv._[0]
if (command === 'search') {
  client.discovery.probe(function () {
    client.close()
  })

  client.discovery.on('device', function (device) {
    console.log(device)
  })
}
else if (command === 'invoke') {
  var address = argv.address
    , operation = argv.operation
    , times = argv.n

  var queue = async.queue(worker, argv.concurrency)

  function worker(reqOpts, cb) {
    client.invoke(reqOpts, cb)
  }

  var reqOpts = {
    to: 'http://192.168.1.2:8080/_SERVICE_ID_',
    action: 'http://192.168.1.2:8080/_SERVICE_ID_/GetStatus'
  }

  for (var i = 0; i < argv.n; i++) {
    queue.push(reqOpts)
  }

  queue.drain = function () {
    console.log('done')
    client.close()
  }
}