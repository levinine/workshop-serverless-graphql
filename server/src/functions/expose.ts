import { Handler } from "aws-lambda";
import {DynamoDB} from "aws-sdk";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import QueryOutput = DocumentClient.QueryOutput;
import {getResponse} from "../helpers/utils";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: Handler = async (): Promise<any> => {
    try {
        const result = await getData();
        const mappedResult = mapOutput(result.Items);
        return getResponse(200, mappedResult);
    } catch (e) {
        return getResponse(500, e);
    }
};

async function getData(): Promise<QueryOutput> {
    return await dynamoDb.query({
        TableName: process.env.DATA_TABLE,
        IndexName: 'typeGSI',
        KeyConditionExpression: '#ItemType = :itemType',
        ExpressionAttributeValues: {
            ':itemType': 'RECORD',
        },
        ExpressionAttributeNames: {
            '#ItemType': 'type',
        },
    }).promise();
}

function mapOutput(items: any[]): any[] {
    return items.map(item => {
        return {
            id: item.id,
            createdAt: new Date(item.createdAt).toISOString(),
            currencies: mapCurrencies(item.currencies)
        }
    });
}

function mapCurrencies(currencies: any[]): any[] {
    return currencies.map(currency => {
        return {
            imageUrl: currency.CoinInfo.ImageUrl,
            algorithm: currency.CoinInfo.Algorithm,
            url: currency.CoinInfo.Url,
            name: currency.CoinInfo.Name,
            fullName: currency.CoinInfo.FullName,
            price: currency.RAW.USD.PRICE,
            change: currency.RAW.USD.CHANGEPCTDAY
        }
    })
}