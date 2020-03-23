import {CloudFrontRequestEvent} from "aws-lambda";

export const handler = async (
    event: CloudFrontRequestEvent
): Promise<any> => {
    const request = event.Records[0].cf.request;
    request.headers['levi9-header'] = [{ key: 'origin-reponse', value: new Date().toISOString() }];
    console.log(JSON.stringify(request.headers));
    return request;
};