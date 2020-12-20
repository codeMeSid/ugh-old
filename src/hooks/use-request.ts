import { RequestUtil } from "@monsid/ugh-og"
import Axios, { AxiosResponse, AxiosError } from "axios";

export const useRequest = (attrs: RequestUtil) => {
  const doRequest = async (onSuccess?: any, onError?: any, body?: any) => {
    try {
      const response: AxiosResponse = await Axios[attrs.method](
        attrs.url,
        body ? body : attrs.body
      );
      if (attrs.onSuccess)
        attrs.onSuccess(response.data);
      if (onSuccess)
        onSuccess(response.data);
      return response.data;
    } catch (err) {
      const error: AxiosError = err;
      if (attrs.onError)
        attrs.onError(error.response.data.errors);
      if (onError)
        onError(error.response.data.errors)
    }
  };
  return { doRequest };
};
