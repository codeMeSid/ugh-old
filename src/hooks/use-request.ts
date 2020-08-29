import axios, { AxiosResponse, AxiosError } from "axios";
import { RequestUtil, HttpMethod } from "@monsid/ugh";

export const useRequest = (attrs: RequestUtil) => {
  const doRequest = async () => {
    try {
      let axiosRequest: any;
      switch (attrs.method) {
        case HttpMethod.Get:
          axiosRequest = axios.get;
          break;
        case HttpMethod.Post:
          axiosRequest = axios.post;
          break;
        case HttpMethod.Put:
          axiosRequest = axios.put;
          break;
      }
      const response: AxiosResponse = await axiosRequest(attrs.url, attrs.body);
      if (attrs.onSuccess) attrs.onSuccess(response.data);
      return response.data;
    } catch (error) {
      const err: AxiosError = error;
      if (attrs.onError) attrs.onError(err.response?.data.errors);
      return err.response?.data.errors;
    }
  };
  return { doRequest };
};
