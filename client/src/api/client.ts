import axios, { CreateAxiosDefaults } from "axios";

const client = axios.create({
  baseURL: "http://10.0.0.9:8000",
});

export default client;
