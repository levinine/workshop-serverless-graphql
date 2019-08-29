const AWS = require('aws-sdk');

const createStream = () => {
    console.log('[CREATE HOOK] Attempt to create stream...');
    const kinesis = new AWS.Kinesis({
        apiVersion: '2013-12-02',
        endpoint: 'http://localhost:4567',
        region: 'eu-east-1'
    });

    if(!process.env.IS_OFFLINE) {
        console.log('[CREATE HOOK] Do not create stream on actual kinesis. Local only...');
        return;
    }

    const createStreamPromise = kinesis.createStream({
        StreamName: 'ingest-dev',
        ShardCount: 1,

    }).promise();

    createStreamPromise
        .then((response) => {
            console.log('[CREATE HOOK] Stream created successfully');
        })
        .catch((err) => {
            console.log('[CREATE HOOK] Stream creation failed', err);
        });

};

createStream();
