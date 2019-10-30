import { RESTDataSource } from 'apollo-datasource-rest';

export class DataService extends RESTDataSource {

    constructor() {
        super();
        this.baseURL = process.env.IS_OFFLINE ? process.env.LOCAL_URL : process.env.REMOTE_URL;
    }

    public async getData(): Promise<any[]> {
        // TODO Implement actual logic for fetching expose lambda results
        // TODO Implement expose lambda
        return await this.get(`${this.baseURL}/expose`);
    }

    public async getHello(): Promise<string> {
        return 'hello world';
    }
}
