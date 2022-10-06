import {AttributeValue, DynamoDBRecord, DynamoDBStreamEvent, Handler} from "aws-lambda";
import {S3} from "aws-sdk";
import {PutObjectRequest} from "aws-sdk/clients/s3";
import axios from 'axios';

let s3 = initS3();

export const handler: Handler = async (
    event: DynamoDBStreamEvent
): Promise<any> => {
    for(let recordIterator = 0; recordIterator < event.Records.length; recordIterator++) {
        await handleDynamodbRecord(event.Records[recordIterator]);
    }
};

async function handleDynamodbRecord(record: DynamoDBRecord) {
    if (record.eventName === 'INSERT') {
        await handleDynamodbInsert(record);
    } else {
        console.log('Unhandled event');
    }
}

async function handleDynamodbInsert(record: DynamoDBRecord) {
    console.log('Dynamodb event', record);
    const currencies = record.dynamodb.NewImage.currencies.L;
    console.log('currencies: ', JSON.stringify(currencies));
    for(let i = 0; i < currencies.length; i++) {
        try {
            console.log('fetching image ', process.env.IMAGE_URL + currencies[i].M.CoinInfo.M.ImageUrl.S);
            let base64Image = await getBase64(process.env.IMAGE_URL + currencies[i].M.CoinInfo.M.ImageUrl.S);
            let response = await uploadToS3(base64Image, currencies[i]);
            console.log('Image was uploaded', response);
        } catch (e) {
            console.log('There was an error uploading image', e.message);
        }
    }
}

async function uploadToS3(base64Image: string, currency: AttributeValue) {
    const uploadParams = {
        Bucket: process.env.ORIGIN_BUCKET_NAME,
        Body: base64Image,
        Key: currency.M.CoinInfo.M.Image.S,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: 'image/png',
    } as PutObjectRequest;
    console.log('Uploading to S3', uploadParams);
    return await s3.upload(uploadParams).promise();
}

async function getBase64(url: string): Promise<any> {
    return axios
        .get(url, {
            responseType: 'arraybuffer'
        })
        .then((response: any) => Buffer.from(response.data, 'binary').toString('base64'))
}

function initS3() {
    return new S3();
}