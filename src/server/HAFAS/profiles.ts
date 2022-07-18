import Crypto from 'crypto';

function getSecret(hciChecksum: string) {
  const enc = Buffer.from(hciChecksum, 'base64');
  const key = Buffer.from([
    97, 72, 54, 70, 56, 122, 82, 117, 105, 66, 110, 109, 51, 51, 102, 85,
  ]);
  const iv = Buffer.alloc(16);
  const cipher = Crypto.createDecipheriv('aes-128-cbc', key, iv);
  const secret = cipher.update(enc, undefined, 'ascii') + cipher.final('ascii');

  return secret;
}

function createChecksumFn(secret: string) {
  return (data: any) => {
    const hasher = Crypto.createHash('md5');

    hasher.update(JSON.stringify(data) + secret);

    return {
      checksum: hasher.digest('hex'),
    };
  };
}

function createMicMacFn(secret: string) {
  return (data: any) => {
    const micHasher = Crypto.createHash('md5');

    micHasher.update(JSON.stringify(data));
    const mic = micHasher.digest('hex');
    const macHasher = Crypto.createHash('md5');

    macHasher.update(mic + secret);

    return { mic, mac: macHasher.digest('hex') };
  };
}

export const vbn = {
  url: 'https://fahrplaner.vbn.de/bin/mgate.exe',
  secret: createMicMacFn(
    getSecret('HLMpSMJpWe8wBXKtp2g1ey+XzkGxhYE3NsONGEmd8GE='),
  ),
  config: {
    client: {
      os: 'iOS 13.4.1',
      id: 'VBN',
      name: 'vbn',
      type: 'IPH',
      v: '6000000',
    },
    ver: '1.18',
    lang: 'de',
    auth: {
      aid: 'kaoxIXLn03zCr2KR',
      type: 'AID',
    },
  },
};

export const smartrbl = {
  url: 'https://db-smartrbl.hafas.de/mct/mgate',
  config: {
    client: {
      id: 'HAFAS',
      name: 'Test-Client',
      type: 'WEB',
      v: '1.0.0',
    },
    lang: 'deu',
    ver: '1.18',
    auth: {
      aid: 'izfpmpj8tnh6acye',
      type: 'AID',
    },
  },
};

export const dbregio = {
  url: 'https://bnav.hafas.de/bin/mgate.exe',
  secret: createMicMacFn(
    getSecret('scuNsYWPma+dzYl3K5cpjb+EsHxQJ/2VGnFwjInCQX4='),
  ),
  config: {
    client: {
      id: 'DB-REGIO-BNAV',
      v: '3000500',
      type: 'IPH',
      name: 'StreckenagentPROD-APPSTORE',
    },
    lang: 'de',
    ext: 'DB.R19.12.a',
    ver: '1.18',
    auth: {
      aid: 'Xd91BNAVkuI6rr6z',
      type: 'AID',
    },
  },
};

export const db = {
  url: 'https://reiseauskunft.bahn.de/bin/mgate.exe',
  secret: createChecksumFn(
    getSecret('rGhXPq+xAlvJd8T8cMnojdD0IoaOY53X7DPAbcXYe5g='),
  ),
  config: {
    client: {
      id: 'DB',
      v: '19040000',
      type: 'AND',
      name: 'DB Navigator',
    },
    ext: 'DB.R21.12.a',
    lang: 'de',
    ver: '1.18',
    auth: {
      aid: 'n91dB8Z77MLdoR0K',
      type: 'AID',
    },
  },
};

export const pkp = {
  url: 'https://mobil.rozklad-pkp.pl:8019/bin/mgate.exe',
  config: {
    client: {
      id: 'HAFAS',
      // v: '4010200',
      type: 'AND',
      // name: 'bilkomAPPSTORE',
    },
    lang: 'en',
    ver: '1.18',
    auth: {
      aid: 'DrxJYtYZQpEBCtcb',
      type: 'AID',
    },
  },
};

export const rmv = {
  url: 'https://www.rmv.de/auskunft/bin/jp/mgate.exe',
  config: {
    client: {
      id: 'RMV',
      l: 'vs_webapp',
      type: 'WEB',
      name: 'webapp',
    },
    ext: 'RMV.1',
    lang: 'de',
    ver: '1.18',
    auth: {
      aid: 'x0k4ZR33ICN9CWmj',
      type: 'AID',
    },
  },
};

export const oebb = {
  url: 'https://fahrplan.oebb.at/bin/mgate.exe',
  config: {
    client: {
      os: 'iOS 12.4',
      id: 'OEBB',
      v: '6020300',
      type: 'IPH',
      name: 'oebbADHOC',
    },
    lang: 'de',
    ver: '1.18',
    auth: {
      aid: 'OWDL4fE4ixNiPBBm',
      type: 'AID',
    },
  },
};

export const sncb = {
  url: 'http://www.belgianrail.be/jp/sncb-nmbs-routeplanner/mgate.exe',
  config: {
    client: {
      os: 'iOS 12.4',
      id: 'SNCB',
      v: '4030200',
      type: 'IPH',
      name: 'sncb',
    },
    lang: 'de',
    ver: '1.18',
    auth: { aid: 'sncb-mobi', type: 'AID' },
  },
};

export const avv = {
  url: 'https://auskunft.avv.de/bin/mgate.exe',
  config: {
    client: {
      id: 'HAFAS',
      type: 'WEB',
      name: 'Test-Client',
      v: '100',
    },
    lang: 'deu',
    ver: '1.18',
    auth: {
      type: 'AID',
      aid: '4vV1AcH3N511icH',
    },
  },
};

export const nahsh = {
  url: 'https://nah.sh.hafas.de/bin/mgate.exe',
  config: {
    client: {
      os: 'iOS 12.4',
      id: 'NAHSH',
      v: '5000100',
      type: 'IPH',
      name: 'NAHSHPROD-APPSTORE',
    },
    lang: 'de',
    ver: '1.18',
    auth: { aid: 'r0Ot9FLFNAFxijLW', type: 'AID' },
  },
};

export const hvv = {
  url: 'https://hvv-app.hafas.de/bin/mgate.exe',
  secret: createMicMacFn(
    getSecret('ktlwfW4vVOf/LwJ4wsnENvzRQZf3WS9b1RMPbIQNEOw='),
  ),
  config: {
    client: {
      os: 'iOS 12.4',
      id: 'HVV',
      v: '4020100',
      type: 'IPH',
      name: 'HVVPROD_ADHOC',
    },
    lang: 'de',
    ext: 'HVV.1',
    ver: '1.18',
    auth: {
      aid: 'andcXUmC9Mq6hjrwDIGd2l3oiaMrTUzyH',
      type: 'aid',
    },
  },
};

export const bvg = {
  url: 'https://bvg-apps.hafas.de/bin/mgate.exe',
  config: {
    client: {
      os: 'iOS 12.4',
      id: 'BVG',
      v: '6021600',
      type: 'IPH',
      name: 'Fahrinfo',
    },
    lang: 'de',
    ver: '1.18',
    auth: {
      aid: 'Mz0YdF9Fgx0Mb9',
      type: 'AID',
    },
  },
};

export const insa = {
  url: 'https://reiseauskunft.insa.de/bin/mgate.exe',
  config: {
    client: {
      os: 'iOS 12.4.1',
      id: 'NASA',
      v: '4020300',
      type: 'IPH',
      name: 'nasaPROD-APPSTORE',
    },
    lang: 'de',
    ver: '1.18',
    auth: {
      aid: 'nasa-apps',
      type: 'AID',
    },
  },
};

export const anachb = {
  url: 'https://anachb.vor.at/bin/mgate.exe',
  config: {
    client: {
      id: 'VAO',
      type: 'WEB',
      name: 'webapp',
    },
    ver: '1.18',
    lang: 'deu',
    ext: 'VAO.10',
    auth: {
      type: 'AID',
      aid: 'wf7mcf9bv3nv8g5f',
    },
  },
};

export const vao = {
  url: 'http://app.verkehrsauskunft.at/bin/mgate.exe',
  config: {
    client: {
      id: 'VAO',
      type: 'IPH',
    },
    ver: '1.18',
    lang: 'deu',
    ext: 'VAO.10',
    auth: {
      type: 'USER',
      user: 'mobile',
      pw: '87a6f8ZbnBih32',
      aid: 'hf7mcf9bv3nv8g5f',
    },
  },
};

export const sbb = {
  url: 'http://fahrplan.sbb.ch/bin/mgate.exe',
  config: {
    auth: {
      aid: 'hf7mcf9bv3nv8g5f',
      type: 'AID',
    },
    client: {
      id: 'DBZUGRADARNETZ',
      type: 'AND',
      v: '',
    },
    ext: 'DBNETZZUGRADAR.2',
    formatted: false,
    lang: 'deu',
    ver: '1.18',
  },
};

export const dbnetz = {
  url: 'https://db-livemaps.hafas.de/bin/mgate.exe',
  config: {
    client: {
      id: 'DBZUGRADARNETZ',
      v: '0.1.0',
      type: 'WEB',
      name: 'webapp',
    },
    ext: 'DBNETZZUGRADAR.2',
    ver: '1.18',
    auth: {
      type: 'AID',
      aid: 'hf7mcf9bv3nv8g5f',
    },
    lang: 'deu',
  },
};
