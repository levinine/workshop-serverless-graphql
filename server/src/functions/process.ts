import {Handler, SQSEvent} from "aws-lambda";
import {DynamoDB} from "aws-sdk";
import { v1 as uuid } from 'uuid';
import {getResponse} from "../helpers/utils";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import PutItemOutput = DocumentClient.PutItemOutput;

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: Handler = async (
    event: SQSEvent
): Promise<any> => {
    console.log('Process SQS event', event);
    try {
        const bodyParsed: any = JSON.parse(event.Records[0].body);
        const preparedMessage = prepareRecord(bodyParsed.data.Data);
        console.log('Storing item', JSON.stringify(preparedMessage));

        const putItemOutput: PutItemOutput = await dynamoDb.put({
            TableName: process.env.DATA_TABLE,
            Item: preparedMessage
        }).promise();
        return getResponse(200, { message: 'Data stored to dynamodb ' + putItemOutput.ConsumedCapacity.CapacityUnits });
    } catch (e) {
        console.log(e);
        return getResponse(500, e);
    }
};

function prepareRecord(data: any) {
    return {
        id: uuid(),
        type: 'RECORD',
        currencies: prepareItem(data),
        createdAt: new Date().getTime()
    }
}

function prepareItem(item: any): any {
    for (let prop in item) {
        if (Object.prototype.hasOwnProperty.call(item, prop) && item[prop] === '') {
            item[prop] = '---empty---';
        }
        if (Object.prototype.hasOwnProperty.call(item, prop) && prop === 'ImageUrl') {
            console.log('image url', item[prop]);
            item['Image'] = item[prop].split('/').slice(-1).pop();
        }
        if (typeof item[prop] === 'object') {
            item[prop] = prepareItem(item[prop]);
        }
    }
    return item;
}