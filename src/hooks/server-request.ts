import Axios, { AxiosResponse, AxiosError } from "axios";

export const serverRequest = async (
  ctx: { req: any },
  attrs: { method: string; url: string; body: any }
) => {
  let data: any, errors: Array<{ message: string }>;
  let response: AxiosResponse;
  try {
    if (typeof window === "undefined") {
      response = await Axios.create({
        baseURL: process.env.BASE_URL,
        headers: ctx?.req?.headers,
      })[attrs.method](attrs.url, attrs.body);
    } else {
      response = await Axios.create({
        baseURL: "/",
      })[attrs.method](attrs.url, attrs.body);
    }
    data = response.data;
  } catch (error) {
    const err: AxiosError = error;
    errors = err?.response?.data?.errors;
  }
  return { data, errors };
};
