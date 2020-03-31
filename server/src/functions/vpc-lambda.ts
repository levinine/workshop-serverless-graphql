import { Handler } from "aws-lambda";
import { SSM } from "aws-sdk";

import { getResponse } from "../helpers/utils";
import { GetParametersRequest } from "aws-sdk/clients/ssm";
import axios from "axios";

let apiKey: string = null;

export const handler: Handler = async (): Promise<any> => {
  try {
    if (! apiKey) {
      apiKey = await getAPIKey();
      console.log(`Evo ga api key ${ apiKey }`);
    }
    const url = process.env.API_URL + 'data/top/totalvolfull?limit=10&tsym=USD&api_key=' + apiKey;
    console.log(`Pulling url - ${ url }`);
    const apiData: any = await fetchData(url);
    console.log(`Pulled data - ${ apiData.data }`);

    return getResponse(200, { message: 'Done!' });
  } catch (e) {
    return getResponse(500, e);
  }
};

async function fetchData(url: string) {
  // since axios timeout parameter is buggy and does not work properly, we're simulating
  // the request timeout by adding a setTimeout before awaiting for the axios.get request
  return new Promise(async (resolve, reject) => {
    setTimeout(() => reject('Request timed-out'), 1000);

    resolve(await axios.get(url));
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
