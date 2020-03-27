// @ƒlow
const config = require('../.babelrc.server');

require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  ...config,
});

global.PROD = true;
const search = require('../src/server/Search').default;

const mostUsedNames = [
  'Frankfurt (Main) Hbf',
  'Karlsruhe Hbf',
  'Hannover Hbf',
  'Hamburg Hbf',
  'Mannheim Hbf',
  'Berlin Hbf',
  'Stuttgart Hbf',
  'Düsseldorf Hbf',
  'Köln Hbf',
  'Leipzig Hbf',
  'München Hbf',
  'Wuppertal Hbf',
  'Nürnberg Hbf',
].map((n) => n.toLowerCase());

Promise.all(mostUsedNames.map((s) => search(s).then((s) => s[0]))).then(
  (stations) => {
    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify(
        stations.map((s) => ({
          title: s.title,
          id: s.id,
        }))
      )
    );
  }
);
