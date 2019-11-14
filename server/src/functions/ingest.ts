import { Handler } from "aws-lambda";
import {SQS} from "aws-sdk";

export const handler: Handler = async (
    event: any
): Promise<any> => {
    let sqs = new SQS();
    let streamUrl;
    if (process.env.IS_OFFLINE) {
        streamUrl = process.env.ENDPOINT + '/' + process.env.QUEUE_NAME;
    } else {
        streamUrl = process.env.QUEUE;
    }
    try {
        await sqs.sendMessage({
            MessageBody: event.body,
            QueueUrl: streamUrl,
            DelaySeconds: 0
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'message sent to queue'
            })
        };
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: e.message })
        }
    }
};
