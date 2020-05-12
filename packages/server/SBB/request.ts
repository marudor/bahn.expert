import { format } from 'date-fns';
import Axios from 'axios';
import crypto from 'crypto';
import fs from 'fs';
import https from 'https';
import path from 'path';
import url from 'url';

// Directly in SBB APP. (ch/sbb/mobile/android/repository/common/h/g.smali)
const staticKey = 'c3eAd3eC3a7845dE98f73942b3d5f9c0';
// Certificate in DER, found in the SBB APP. (res/raw/ca_cert.crt)
const certificateBuffer = fs.readFileSync(
  path.resolve(__dirname, 'certificate.crt')
);
const certificateBasedKey = crypto
  .createHash('sha1')
  .update(certificateBuffer)
  .digest('base64');

const rawKey = certificateBasedKey + staticKey;
const key = crypto.createHash('sha256').update(rawKey).digest('hex');

export const axios = Axios.create({
  baseURL: 'https://active.vnext.app.sbb.ch',
  httpsAgent: new https.Agent({
    // Self signed used - we could add the root certificate, but not checking is okay here.
    rejectUnauthorized: false,
  }),
});
axios.interceptors.request.use((config) => {
  const urlPath = url.parse(config.url!).path!;
  const today = format(Date.now(), 'yyyy-MM-dd');
  const apiKey = crypto
    .createHmac('sha1', key)
    .update(urlPath + today)
    .digest('base64');
  config.headers = config.headers || {};
  console.log(urlPath, today, apiKey);
  config.headers['X-API-DATE'] = today;
  config.headers['X-API-AUTHORIZATION'] = apiKey;
  config.headers['User-Agent'] =
    'SBBmobile/flavorprodRelease-10.5.2-RELEASE Android/9 (Google;Pixel 3a XL)';
  return config;
});
