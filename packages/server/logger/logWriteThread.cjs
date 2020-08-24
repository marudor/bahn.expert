const { parentPort } = require('worker_threads');
const Axios = require('axios');
const { Timber } = require('@timberio/node');
const pinoPretty = require('pino-pretty');

const prettyLog = pinoPretty({
  colorize: true,
  translateTime: true,
});
const streams = [
  (msg) => {
    process.stdout.write(prettyLog(JSON.stringify(msg)));
  },
];

const logglyToken = process.env.LOGGLY_TOKEN;

if (process.env.NODE_ENV === 'production' && logglyToken) {
  // eslint-disable-next-line no-console
  console.log('Using loggly to log');
  streams.push((msg) => {
    // 30 is info, we log warn and above to loggly
    if (msg.level > 30) {
      Axios.post(
        `https://logs-01.loggly.com/inputs/${logglyToken}`,
        JSON.stringify(msg),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
    }
  });
}

const timberSource = process.env.TIMBER_SOURCE;
const timberToken = process.env.TIMBER_TOKEN;

if (process.env.NODE_ENV === 'production' && timberSource && timberToken) {
  // eslint-disable-next-line no-console
  console.log('Using Timber to log');
  const timber = new Timber(timberToken, timberSource);
  const timberLevelMap = {
    20: 'debug',
    30: 'info',
    40: 'warn',
    50: 'error',
  };

  streams.push((msg) => {
    // 30 is info, we log warn and above to timber
    if (msg.level > 30) {
      timber.log(msg.msg, timberLevelMap[msg.level] || msg.level, msg);
    }
  });
}

parentPort.on('message', (msg) => {
  const parsedMsg = JSON.parse(msg);

  streams.forEach((s) => s(parsedMsg));
});
