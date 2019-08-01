import { createApp } from 'server/app';
import { Server } from 'net';
import Nock from 'nock';
import path from 'path';
import request from 'supertest';

let server: Server;

afterAll(() => {
  if (server) {
    server.close();
  }
});

export const checkApi = async (
  path: string,
  status: number = 200,
  postBody?: Object
) => {
  if (!server) {
    server = (await createApp()).listen();
  }
  let r;

  if (postBody) {
    r = request(server)
      .post(path)
      .send(postBody);
  } else {
    r = request(server).get(path);
  }
  await r.expect(res => {
    expect(res.status).toBe(status);
    if (res.type === 'application/json') {
      expect(JSON.parse(res.text)).toMatchSnapshot();
    } else {
      expect(res.text).toMatchSnapshot();
    }
  });
};

export const mockWithFile = (
  host: string,
  remotePath: string,
  filePath: string,
  method: 'get' | 'post' = 'get',
  times: number = 1
) => {
  Nock(host)
    [method](remotePath)
    .times(times)
    .replyWithFile(200, path.resolve(__dirname, '__fixtures__', filePath));
};
