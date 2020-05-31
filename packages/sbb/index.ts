import { extend } from 'umi-request';
import { format } from 'date-fns';
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

export const request = extend({
  prefix: 'https://active.vnext.app.sbb.ch',
  // @ts-expect-error - agent works!
  agent: new https.Agent({
    // Self signed used - we could add the root certificate, but not checking is okay here.
    rejectUnauthorized: false,
  }),
});
request.interceptors.request.use((requestUrl, options) => {
  const urlPath = url.parse(decodeURIComponent(requestUrl)).path!;
  const today = format(Date.now(), 'yyyy-MM-dd');
  const apiKey = crypto
    .createHmac('sha1', key)
    .update(urlPath + today)
    .digest('base64');
  Object.assign(options.headers, {
    'X-API-DATE': today,
    'X-API-AUTHORIZATION': apiKey,
    'User-Agent':
      'SBBmobile/flavorprodRelease-10.5.2-RELEASE Android/9 (Google;Pixel 3a XL)',
  });

  return {
    url: requestUrl,
    options,
  };
});
