import { Handler } from "aws-lambda";
import {SQS} from "aws-sdk";
import {getResponse} from "../helpers/utils";
import {SendMessageResult} from "aws-sdk/clients/sqs";

let streamUrl = process.env.QUEUE;
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
    return new SQS();
}