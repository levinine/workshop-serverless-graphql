import {DynamoDBStreamEvent, Handler} from "aws-lambda";
import {S3} from "aws-sdk";
import {PutObjectRequest} from "aws-sdk/clients/s3";
import axios from 'axios';

const s3 = new S3();

export const handler: Handler = async (
    event: DynamoDBStreamEvent
): Promise<any> => {
    const currencies = event.Records[0].dynamodb.NewImage.currencies.L;
    console.log('currencies: ', JSON.stringify(currencies));
    for(let i = 0; i < currencies.length; i++) {
        console.log('fetching image ', process.env.IMAGE_URL + currencies[i].M.CoinInfo.M.ImageUrl.S);
        let base64Image = await getBase64(process.env.IMAGE_URL + currencies[i].M.CoinInfo.M.ImageUrl.S);
        const uploadParams = {
            Bucket: process.env.ORIGIN_BUCKET_NAME,
            Body: base64Image,
            Key: currencies[i].M.CoinInfo.M.ImageUrl.S,
            ACL: 'authenticated-read',
            ContentType: 'image/png',
        } as PutObjectRequest;
        console.log('Uploading to S3', uploadParams);
        await s3.upload(uploadParams).promise();
    }
};

async function getBase64(url: string): Promise<any> {
    return axios
        .get(url, {
            responseType: 'arraybuffer'
        })
        .then((response: any) => Buffer.from(response.data, 'binary').toString('base64'))
}