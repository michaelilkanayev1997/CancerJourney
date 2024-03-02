import { Keys, getFromAsyncStorage } from "@utils/asyncStorage";
import axios, { CreateAxiosDefaults } from "axios";

const baseURL = "http://10.0.0.9:8000";

const client = axios.create({
  baseURL,
});

type headers = CreateAxiosDefaults<any>["headers"];

export const getClient = async (headers?: headers) => {
  const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);

  if (!token) return axios.create({ baseURL });

  const defaultHeaders = {
    Authorization: "Bearer " + token,
    ...headers,
  };

  return axios.create({ baseURL, headers: defaultHeaders });
};

export default client;
