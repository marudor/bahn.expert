/* eslint-disable unicorn/prefer-module */
const config = require('../babel.config');

require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  ...config,
});

const search = require('../src/server/StopPlace/search').searchStopPlace;

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
  (stopPlaces) => {
    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify(
        stopPlaces.map((s) => ({
          title: s.title,
          id: s.id,
        })),
      ),
    );
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
  },
);
