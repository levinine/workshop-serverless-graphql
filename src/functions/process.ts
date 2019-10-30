import {Handler, SQSEvent} from "aws-lambda";
import {DynamoDB} from "aws-sdk";
import * as uuid from 'uuid/v1';

export const handler: Handler = async (
    event: SQSEvent
): Promise<any> => {
    console.log('Hello from process. Event from SQS below');
    console.log(event);
    const dynamoDb = new DynamoDB.DocumentClient();
    try {
        const record: string = event.Records[0].body;
        const bodyParsed: any = JSON.parse(record);
        const preparedMessage = {
            id: uuid(),
            type: 'RECORD',
            currencies: prepareItem(bodyParsed.data.Data),
            createdAt: new Date().getTime()
        };
        console.log('Storing item', JSON.stringify(preparedMessage));

        await dynamoDb.put({
            TableName: process.env.DATA_TABLE,
            Item: preparedMessage
        }).promise();
        return {
            statusCode: 200,
            body: JSON.stringify('data stored to dynamodb')
        }
    } catch (e) {
        console.log(e);
        return {
            statusCode: 200,
            body: JSON.stringify(e.message)
        }
    }
};

function prepareItem(item: any): any {
    for (let prop in item) {
        if (Object.prototype.hasOwnProperty.call(item, prop) && item[prop] === '') {
            item[prop] = '---empty---';
        }
        if (typeof item[prop] === 'object') {
            prepareItem(item[prop]);
        }
    }
    return item;
}