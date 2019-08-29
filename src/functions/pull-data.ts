import { Handler, Context, Callback } from 'aws-lambda';
import axios from 'axios';
import { Lambda } from "aws-sdk";

export const handler: Handler = async (event: any, context: Context, callback: Callback): Promise<any> => {
    const lambda = new Lambda();
    const url = process.env.API_URL + '/data/top/totalvolfull?limit=10&tsym=USD&api_key=' + process.env.API_KEY;
    console.log(url);
    const apiData = await axios.get(url);
    console.log(apiData.data);
    const response = {
        statusCode: 200,
        body: JSON.stringify(apiData.data)
    };
    const result = await lambda.invoke({
        FunctionName: 'ingest',
        LogType: 'Tail',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(apiData.data)
    });

    console.log(result);
    return response;
};
