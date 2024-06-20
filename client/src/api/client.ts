import axios, { CreateAxiosDefaults } from "axios";
import axiosRetry from "axios-retry";

import { Keys, getFromAsyncStorage } from "@utils/asyncStorage";

const baseURL = "http://10.0.0.8:8000";

const client = axios.create({
  baseURL,
  timeout: 5000, // 5 seconds
});

// Configure axios-retry
axiosRetry(client, {
  retries: 2, // Number of retries
  retryDelay: axiosRetry.exponentialDelay, // Exponential back-off retry delay between requests
  retryCondition: (error) => {
    console.log("retrying....", error.isAxiosError && !error.response);
    // Only retry on network errors
    return error.isAxiosError && !error.response;
  },
});

type headers = CreateAxiosDefaults<any>["headers"];

export const getClient = async (headers?: headers, withRetry = true) => {
  const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);

  if (!token) return axios.create({ baseURL });

  const defaultHeaders = {
    Authorization: "Bearer " + token,
    ...headers,
  };

  const instance = axios.create({
    baseURL,
    headers: defaultHeaders,
    timeout: 5000, // 5 seconds
  });

  if (withRetry) {
    // Configure axios-retry
    axiosRetry(instance, {
      retries: 2, // Number of retries
      retryCondition: (error) => {
        console.log("retrying...", error.isAxiosError && !error.response);
        // Only retry on network errors
        return error.isAxiosError && !error.response;
      },
    });
  }

  return instance;
};

export default client;
