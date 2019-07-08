'use strict';
const aws = require('aws-sdk');
const kinesis = new aws.Kinesis()
const stream_name = process.env.streamname

module.exports.publisher = (event, context, callback) => {
  console.log(stream_name)
  for (var i = 0; i < 100; i++) {
    _writeToKinesis();
  }
  function _writeToKinesis() {
    const cur_time = new Date().getMilliseconds();
    const sensor = "sensor-" + Math.floor(Math.random() * 100000)
    const reading = Math.floor(Math.random() * 1000000)

    const record = JSON.stringify({
      time: cur_time,
      sensor: sensor,
      reading: reading
    })

    var ParamRecord = {
      StreamName: stream_name,
      PartitionKey: sensor,
      Data: record
    }
    kinesis.putRecord(ParamRecord, (err, data) => {
      if (err) {
        console.error(err)
      } else {
        console.log('Successfully sent data to kinesis')
      }
    })
  }
};

module.exports.consumer = (event, context, callback) => {
  // Kinesis data is base64 encoded so decode here
  var totoalReading = 0;
  event.Records.forEach((record) => {
    const payload = new Buffer(record.kinesis.data, 'base64').toString('ascii');
    console.log(payload);
    const payloadObj = JSON.parse(payload);
    totoalReading += payloadObj.reading
    console.log('Total reading now is:', totoalReading)
  })
  var averageReading = totoalReading / event.Records.length;
  console.log('Successfully processed' + event.Records.length + 'records')
  console.log(null, "Average reading in batch was" + averageReading)

}