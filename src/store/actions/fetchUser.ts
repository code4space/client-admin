import { baseUrl, baseUrl1 } from "@/constant/url";
import { getCookie } from "@/components/cookie";
import { LOGGER, USER } from "./actionType";
import axios from "axios";

export function userFetchSuccess(payload: object) {
  return {
    type: USER,
    payload,
  };
}

export function getUser(page: number = 1, from?: string, to?: string): any {
  return async (dispatch: Function) => {
    try {
      let url = `${baseUrl}/user/all/?page=${page}`
      if (from) url += `&from=${from}`
      if (to) url += `&to=${to}`


      const response = await axios({
        url,
        method: 'GET',
        headers: { access_token: getCookie("access_token") }
      })
      dispatch(userFetchSuccess(response.data));
    } catch (error) {
      console.log(error);
    }
  };
}

export function loggerFetchSuccess(payload: object) {
  return {
    type: LOGGER,
    payload,
  };
}

export function getLogger(page: number = 1, from?: string, to?: string): any {
  return async (dispatch: Function) => {
    try {
      const response = await axios({
        url: `${baseUrl1}/logger`,
        method: 'GET',
        headers: { access_token: getCookie("access_token") }
      })
      dispatch(loggerFetchSuccess(response.data));
    } catch (error) {
      console.log(error);
    }
  };
}