import { S3 } from 'aws-sdk';
import { GetObjectOutput, PutObjectOutput } from 'aws-sdk/clients/s3';

export async function getImage(
  client: S3,
  bucket: string,
  path: string,
): Promise<GetObjectOutput> {
  return client
    .getObject({
      Key: path,
      Bucket: bucket,
    })
    .promise()
    .catch(e => {
      console.log(
        `Error while getting image with key: ${path} from bucket: ${bucket}`,
      );
      e.code = '404';
      e.desc = 'Not found';
      throw e;
    });
}

export async function storeImage(
  client: S3,
  image: Buffer,
  bucket: string,
  writePath: string,
  writeFormat: string,
): Promise<PutObjectOutput> {
  return client
    .putObject({
      Body: image,
      Bucket: bucket,
      Key: writePath,
      ContentType: `image/${writeFormat}`,
      StorageClass: 'STANDARD',
      CacheControl: 'max-age=31536000',
    })
    .promise()
    .catch(e => {
      console.log(
        `Error while writing image with key: ${writePath} to the bucket: ${bucket}`,
      );
      e.code = '500';
      e.desc = 'Failed to store';
      throw e;
    });
}
