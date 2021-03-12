const config = require('../babel.config');

require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  ...config,
});

global.PROD = true;
const search = require('../packages/server/Search').default;

const mostUsedNames = [
  'Frankfurt (Main) Hbf',
  'Karlsruhe Hbf',
  'Stuttgart Hbf',
  'Hamburg Hbf',
  'Hannover Hbf',
  'Düsseldorf Hbf',
  'Köln Hbf',
  'Berlin Hbf',
  'Mannheim Hbf',
  'München Hbf',
  'Nürnberg Hbf',
  'Ulm Hbf',
].map((n) => n.toLowerCase());

Promise.all(mostUsedNames.map((s) => search(s).then((s) => s[0]))).then(
  (stations) => {
    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify(
        stations.map((s) => ({
          title: s.title,
          id: s.id,
        })),
      ),
    );
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  },
);
