const { parentPort } = require('worker_threads');
const Axios = require('axios');
const pinoPretty = require('pino-pretty');

const prettyLog = pinoPretty.prettyFactory({
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
  streams.push(async (msg) => {
    // 30 is info, we log warn and above to loggly
    if (msg.level > 30) {
      try {
        await Axios.post(
          `https://logs-01.loggly.com/inputs/${logglyToken}`,
          JSON.stringify(msg),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        );
      } catch {
        // Logging failed, lets just drop this then :(
      }
    }
  });
}

parentPort.on('message', (msg) => {
  const parsedMsg = JSON.parse(msg);

  streams.forEach((s) => s(parsedMsg));
});
