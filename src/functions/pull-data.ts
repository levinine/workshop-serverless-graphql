import { Handler, Context, Callback } from 'aws-lambda';
import axios from 'axios';

export const handler: Handler = async (event: any, context: Context, callback: Callback): Promise<any> => {
    const apiUrl = process.env.IS_OFFLINE ? process.env.LOCAL_URL : process.env.REMOTE_URL;
    const url = process.env.API_URL + '/data/top/totalvolfull?limit=10&tsym=USD&api_key=' + process.env.API_KEY;
    const apiData = await axios.get(url);
    try {
        await axios.post(  apiUrl + '/ingest', {
            data: apiData.data
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                err: e.message,
                stack: e,
                error: 'Failed to invoke ingest lambda'
            })
        }
    }
};
