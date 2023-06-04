/* eslint-disable babel/no-invalid-this */
import { logger } from '@/server/logger';
import Axios from 'axios';

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
    url = `${this.baseURL}url`;
  }
  logger.debug(`axiosRequest (${this.method}): ${url}`);
  if (data) {
    return data;
  }
});
