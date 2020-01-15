import {Handler} from "aws-lambda";
import {S3} from "aws-sdk";
import {URIUtil} from "../services/uri.util";
import {GetObjectOutput} from "aws-sdk/clients/s3";
import * as S3ClientUtil from '../services/s3-client.util';

export const handler: Handler = async (
    event: any
): Promise<any> => {
    /**
     * If image is not found on cache bucket
     * Response status code is 403, Forbidden
     *
     * If image is found,
     * Response status code is 200 OK
     *
     * If an object hasn't changed since the last time CloudFront requested it
     * Response status code is 304, Not Modified
     */

    const originResponse = event.Records[0].cf;

    console.log('Recieved request: ', originResponse);

    /**
     * if 2**
     * return the response
     */
    if (
        (parseInt(originResponse.response.status) >= 200 &&
            parseInt(originResponse.response.status) < 300) ||
        parseInt(originResponse.response.status) === 304
    ) {
        originResponse.response.status = '200';
        originResponse.response.statusDescription = 'OK';
        return originResponse.response;
    }

    /**
     * Since environment variables cannot be used for edge function,
     * OriginCustomHeaders are set for S3 cache bucket
     * 'cache_bucket_name' and 'origin_bucket_name',
     * that represents bucket names for deployed stage
     */
    const s3Origin = originResponse.request.origin['s3'];
    const cacheBucketName: string =
        s3Origin.customHeaders['cache_bucket_name'][0].value;
    const originBucketName: string =
        s3Origin.customHeaders['origin_bucket_name'][0].value;

    const s3Client = new S3({
        apiVersion: 'latest',
        region: s3Origin.region,
    });

    const params = URIUtil.extractParams(
        originResponse.request.uri,
    );

    try {
        const s3object: GetObjectOutput = await S3ClientUtil.getImage(
            s3Client,
            originBucketName,
            params.imageId,
        );

        const writeFilePath = originResponse.request.uri.slice(1);

        await S3ClientUtil.storeImage(
            s3Client,
            s3object.Body as Buffer,
            cacheBucketName,
            writeFilePath,
            params.writeFormat,
        );

        originResponse.response.body = s3object.Body.toString('base64');
        originResponse.response.bodyEncoding = 'base64';
        originResponse.response.status = '200';
        originResponse.response.headers['content-type'] = [
            {
                key: 'Content-Type',
                value: `image/jpg`,
            },
        ];
    } catch (error) {
        console.log(error);

        originResponse.response.status = error.code || '500';
        originResponse.response.statusDescription =
            error.desc || 'Internal server error';
    }

    return originResponse.response;
};