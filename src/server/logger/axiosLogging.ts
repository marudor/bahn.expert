/* eslint-disable babel/no-invalid-this */
import { logger } from '@/server/logger';
import { v4 } from 'uuid';
import Axios from 'axios';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    maru?: {
      id: string;
    };
  }
}

if (!Array.isArray(Axios.defaults.transformRequest)) {
  if (Axios.defaults.transformRequest) {
    Axios.defaults.transformRequest = [Axios.defaults.transformRequest];
  } else {
    Axios.defaults.transformRequest = [];
  }
}
Axios.defaults.transformRequest.push(function (data, _headers) {
  let url = this.url;
  if (url?.startsWith('/')) {
    url = `${this.baseURL}${url}`;
  }
  if (!this.maru) {
    this.maru = {
      id: v4(),
    };
  }
  logger.debug(
    {
      id: this.maru.id,
      method: this.method?.toUpperCase(),
      url,
    },
    'Request',
  );
  if (data) {
    return data;
  }
});

if (!Array.isArray(Axios.defaults.transformResponse)) {
  if (Axios.defaults.transformResponse) {
    Axios.defaults.transformResponse = [Axios.defaults.transformResponse];
  } else {
    Axios.defaults.transformResponse = [];
  }
}

Axios.defaults.transformResponse.push(function (data, _header, status) {
  let url = this.url;
  if (url?.startsWith('/')) {
    url = `${this.baseURL}${url}`;
  }
  const logFn = (status === 200 ? logger.debug : logger.warn).bind(logger);
  logFn(
    {
      id: this.maru?.id || 'unknown',
      method: this.method?.toUpperCase(),
      url,
    },
    `${status} - Response`,
  );
  return data;
});
