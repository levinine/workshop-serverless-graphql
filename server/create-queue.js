const SQS = require('aws-sdk').SQS;

let sqs = new SQS({
    apiVersion: '2012-11-05',
    accessKeyId: 'root',
    secretAccessKey: 'root',
    endpoint: 'http://localhost:9324',
    region: 'eu-west-1'
});
let params = {
    QueueName: process.argv[2],
    Attributes: {
        'DelaySeconds': '1',
        'MessageRetentionPeriod': '3600'
    }
};
sqs.createQueue(params).promise()
    .then((queue) => {
        console.log(`[INFO] created queue ${process.env.QUEUE_NAME} at ${queue.QueueUrl}`);
    })
    .catch(error => {
        console.error(`[ERROR] ${error.message}`);
    });