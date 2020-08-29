import { RequestUtil } from "@monsid/ugh";
import Axios, { AxiosResponse, AxiosError } from "axios";

export const useRequest = (attrs: RequestUtil) => {
  const doRequest = async () => {
    try {
      const response: AxiosResponse = await Axios[attrs.method](
        attrs.url,
        attrs.body
      );
      if (attrs.onSuccess) attrs.onSuccess(response.data);
      return response.data;
    } catch (err) {
      const error: AxiosError = err;
      if (attrs.onError) attrs.onError(error.response.data.errors);
      // return error.response.data.errors;
    }
  };
  return { doRequest };
};
