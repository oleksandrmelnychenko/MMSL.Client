import { ajax } from 'rxjs/ajax';
import { TokenHelper } from './token.helper';
import * as API from '../redux/constants/api.constants';

import { map } from 'rxjs/operators';
import { IApplicationState } from '../redux/reducers/index';
import { getActiveLanguage } from 'react-localize-redux';

export interface IWebResponse {
  body: Object;
  message: string;
  statusCode: number;
}

export interface QueryParam {
  key: string;
  value: string;
}

const buildQueryParamsString = (queryParams?: QueryParam[]) => {
  let queryString = '';

  if (queryParams && queryParams.length > 0) {
    if (
      queryParams !== null &&
      queryParams !== undefined &&
      queryParams.length > 0
    ) {
      for (let i = 0; i < queryParams.length; i++) {
        if (i === 0) queryString += '?';
        else queryString += '&';

        queryString += `${queryParams[i].key}=${queryParams[i].value}`;
      }
    }

    if (queryString === null || queryString === undefined) queryString = '';
  }

  return queryString;
};

export const ajaxGetWebResponse = (
  urlPath: string,
  state: IApplicationState,
  queryParams?: QueryParam[]
) => {
  const currentLanguage = getActiveLanguage(state.localize).code;
  let queryString = `${
    API.SERVER_URL
  }/${currentLanguage}${urlPath}${buildQueryParamsString(queryParams)}`;

  return ajax
    .getJSON<IWebResponse>(queryString, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TokenHelper.getAccessToken()}`,
    })
    .pipe(map((response) => response.body));
};

export const ajaxPostResponse = (
  urlPath: string,
  body: any,
  state: IApplicationState,
  token = false
) => {
  const currentLanguage = getActiveLanguage(state.localize).code;
  let header = {
    'Content-Type': 'application/json',
  };

  if (token) {
    header = Object.assign(header, {
      Authorization: `Bearer ${TokenHelper.getAccessToken()}`,
    });
  }

  return ajax
    .post(`${API.SERVER_URL}/${currentLanguage}${urlPath}`, body, header)
    .pipe(map((response) => response.response));
};

export const ajaxPostResponse_file = (
  urlPath: string,
  body: any,
  state: IApplicationState
) => {
  const currentLanguage = getActiveLanguage(state.localize).code;

  const header = {
    Authorization: `Bearer ${TokenHelper.getAccessToken()}`,
  };

  return ajax
    .post(`${API.SERVER_URL}/${currentLanguage}${urlPath}`, body, header)
    .pipe(map((response) => response.response));
};

export const ajaxPutResponse = (
  urlPath: string,
  body: any,
  state: IApplicationState
) => {
  const currentLanguage = getActiveLanguage(state.localize).code;
  let header = {
    Authorization: `Bearer ${TokenHelper.getAccessToken()}`,
    'Content-Type': 'application/json',
  };
  return ajax
    .put(`${API.SERVER_URL}/${currentLanguage}${urlPath}`, body, header)
    .pipe(map((response) => response.response));
};

export const ajaxPutFormDataResponse = (
  urlPath: string,
  body: any,
  state: IApplicationState
) => {
  const currentLanguage = getActiveLanguage(state.localize).code;
  let header = {
    Authorization: `Bearer ${TokenHelper.getAccessToken()}`,
  };

  return ajax
    .put(`${API.SERVER_URL}/${currentLanguage}${urlPath}`, body, header)
    .pipe(map((response) => response.response));
};

export const ajaxDeleteResponse = (
  urlPath: string,
  state: IApplicationState,
  queryParams?: QueryParam[]
) => {
  const currentLanguage = getActiveLanguage(state.localize).code;
  let header = {
    Authorization: `Bearer ${TokenHelper.getAccessToken()}`,
  };

  let queryString = `${
    API.SERVER_URL
  }/${currentLanguage}${urlPath}${buildQueryParamsString(queryParams)}`;

  return ajax
    .delete(queryString, header)
    .pipe(map((response) => response.response));
};
