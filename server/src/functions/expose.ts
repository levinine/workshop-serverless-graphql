import { Handler, Context, Callback } from "aws-lambda";
import {DynamoDB} from "aws-sdk";

export const handler: Handler = async (
    event: any,
): Promise<any> => {
    const dynamoDb = new DynamoDB.DocumentClient();
    const result = await dynamoDb.query({
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

    const mappedResult = mapOutput(result.Items);
    return {
        statusCode: 200,
        body: JSON.stringify(mappedResult)
    }
};

function mapOutput(items: any[]): any[] {
    return items.map(item => {
        return {
            id: item.id,
            createdAt: item.createdAt,
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