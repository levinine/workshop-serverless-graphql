import { Handler, Context, Callback } from "aws-lambda";

export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback
): Promise<any> => {
    console.log('[INGEST]: ', event);
    const response = {
        StatusCode: 200,
        Body: JSON.stringify({ hello: 'world' })
    };
    return response;
};
