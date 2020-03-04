import { Handler } from "aws-lambda";
import {SQS} from "aws-sdk";
import {getResponse} from "../helpers/utils";
import {SendMessageResult} from "aws-sdk/clients/sqs";

let streamUrl = process.env.QUEUE;
if (process.env.IS_OFFLINE) {
    streamUrl = process.env.ENDPOINT + '/queue/' + process.env.QUEUE_NAME;
}
let sqs = initializeSQS();

export const handler: Handler = async (
    event: any
): Promise<any> => {
    try {
        const sendMessageResult: SendMessageResult =  await sqs.sendMessage({
            MessageBody: event.body,
            QueueUrl: streamUrl,
            DelaySeconds: 0
        }).promise();

        return getResponse(200, {
            message: 'Message sent to queue ' + sendMessageResult.MessageId
        });
    } catch (e) {
        return getResponse(500, e);
    }
};

function initializeSQS(): SQS {
    let sqs: SQS;
    if (process.env.IS_OFFLINE) {
        sqs = new SQS({
            apiVersion: '2012-11-05',
            accessKeyId: 'root',
            secretAccessKey: 'root',
            endpoint: 'http://localhost:9324'
        });
    } else {
        sqs = new SQS();
    }
    return sqs;
}