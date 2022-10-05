import { Handler } from 'aws-lambda';
import axios from 'axios';
import {getResponse} from "../helpers/utils";
import {GetParametersRequest} from "aws-sdk/clients/ssm";
import {SSM} from "aws-sdk";

let apiKey: string = null;
const apiGatewayUrl = process.env.REMOTE_URL;

export const handler: Handler = async (): Promise<any> => {
    try {
        if (!apiKey) {
            apiKey = await getAPIKey();
        }
        const url = process.env.API_URL + 'data/top/totalvolfull?limit=10&tsym=USD&api_key=' + apiKey;
        const apiData = await fetchData(url);
        const ingestResult = await pushDataToIngest(apiGatewayUrl, apiData);
        console.log('Ingest result: ', ingestResult);
        return getResponse(200, { message: 'Data pushed to ingest' });
    } catch (e) {
        console.log(e);
        return getResponse(500, e);
    }
};

async function fetchData(url: string) {
    const response = await axios.get(url);
    return response.data;
}

async function pushDataToIngest(url: string, data: any) {
    console.log('sending data to ingest lambda at ', url + 'ingest');
    return await axios.post(   url + 'ingest', {
        data: data
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

async function getAPIKey(): Promise<string> {
    const ssm = new SSM();
    const req: GetParametersRequest = {
        Names: [`API_KEY`],
        WithDecryption: true,
    };
    const response = await ssm.getParameters(req).promise();
    console.log(JSON.stringify(response));
    return response.Parameters[0].Value;
}