import { Handler } from 'aws-lambda';
import axios from 'axios';
import {getResponse} from "../helpers/utils";

const apiUrl = process.env.IS_OFFLINE ? process.env.LOCAL_URL : process.env.REMOTE_URL;
const url = process.env.API_URL + 'data/top/totalvolfull?limit=10&tsym=USD&api_key=' + process.env.API_KEY;

export const handler: Handler = async (): Promise<any> => {
    try {
        const apiData = await fetchData(url);
        const ingestResult = await pushDataToIngest(apiUrl, apiData);
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
    console.log('sending data to ingest lambda at ', apiUrl + 'ingest');
    return await axios.post(   url + 'ingest', {
        data: data
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}