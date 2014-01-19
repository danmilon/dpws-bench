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
  .boolean('s')
  .alias('s', 'stats')
  .default('n', 5)
  .default('s', false)
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
    , rootStart = process.hrtime()

  var queue = async.queue(worker, argv.concurrency)

  console.log('# id duration(ms)')
  function worker(req, cb) {
    var timeStart = process.hrtime()
    client.invoke(req, function (err, res) {
      if (err) {
        throw err
      }

      var timeEnd = process.hrtime()
      var duration = [timeEnd[0] - timeStart[0], timeEnd[1] - timeStart[1] ]
        , durationMs = duration[0] * 1e3 + duration[1] / 1e6

      process.stdout.write(req.id.toString() + ' ' + durationMs.toString() + '\n')

      cb()
    })
  }

  for (var i = 1; i <= argv.n; i++) {
    var reqOpts = {
      to: 'http://192.168.1.10:1337/_SERVICE_ID_',
      action: 'http://192.168.1.10:1337/_SERVICE_ID_/GetStatus',
      id: i
    }

    queue.push(reqOpts)
  }

  queue.drain = function () {
    var duration = process.hrtime(rootStart)
      , duration = duration[0] + duration[1] / 1e9
      , rps = argv.n / duration

    console.log('# rps: ' + rps)
    console.error('done')
    client.close()
  }
}
