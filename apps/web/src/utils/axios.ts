import axios from "axios";
import { getCookie } from "cookies-next";

// eslint-disable-next-line turbo/no-undeclared-env-vars
const baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT;

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_API_ENDPOINT is not defined");
}

const axiosInstance = axios.create({
  baseURL,
  headers: {
    authorization: getCookie("authorization") ?? "",
  },
});

export default axiosInstance;
