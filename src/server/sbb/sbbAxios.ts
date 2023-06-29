import axios from 'axios';

export const sbbAxios = axios.create({
  baseURL: 'https://graphql.beta.sbb.ch',
  headers: {
    'apollographql-client-name': 'sbb-webshop',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/115.0',
  },
});
