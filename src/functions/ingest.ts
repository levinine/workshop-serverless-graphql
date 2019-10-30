import { Handler } from "aws-lambda";
import {SQS} from "aws-sdk";

export const handler: Handler = async (
    event: any
): Promise<any> => {
    let sqs = new SQS();
    const response = {
        statusCode: 200,
        Body: JSON.stringify({ hello: 'world' })
    };
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
        console.log(response);
        return response;
    } catch (e) {
        console.log(e);
        return {
            statusCode: 500,
            Body: JSON.stringify({ error: e.message })
        }
    }
};
