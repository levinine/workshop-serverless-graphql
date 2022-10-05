import axios from 'axios';

export class DataService {
    public static async getCurrencies(): Promise<any[]> {
        const baseURL = process.env.REMOTE_URL;

        const currencies = await axios.get(`${baseURL}/expose`);
        console.log('currencies', currencies.data);
        return currencies.data;
    }
}
