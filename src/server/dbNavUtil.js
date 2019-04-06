// @flow
import Crypto from 'crypto';

function getSecret() {
  const enc = Buffer.from('rGhXPq+xAlvJd8T8cMnojdD0IoaOY53X7DPAbcXYe5g=', 'base64');
  const key = Buffer.from([97, 72, 54, 70, 56, 122, 82, 117, 105, 66, 110, 109, 51, 51, 102, 85]);
  const iv = Buffer.alloc(16);
  const cipher = Crypto.createDecipheriv('aes-128-cbc', key, iv);
  const secret = cipher.update(enc, undefined, 'ascii') + cipher.final('ascii');

  return secret;
}

export const secret = getSecret();

export default function createChecksum(data: any) {
  const hasher = Crypto.createHash('md5');

  hasher.update(JSON.stringify(data) + secret);

  return hasher.digest('hex');
}
