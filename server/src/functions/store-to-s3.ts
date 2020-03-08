import {DynamoDBStreamEvent, Handler} from "aws-lambda";
import {S3} from "aws-sdk";

const s3 = new S3();

export const handler: Handler = async (
    event: DynamoDBStreamEvent
): Promise<any> => {
    const newImage = event.Records[0].dynamodb.NewImage;
    console.log('new image: ', JSON.stringify(newImage));
};