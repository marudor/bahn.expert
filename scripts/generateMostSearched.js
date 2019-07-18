// @ƒlow
const config = require('../.babelrc.server');

require('@babel/register')(config);

global.PROD = true;
const search = require('../dist/server/server/Search').default;

const mostUsedNames = [
  'Frankfurt (Main) Hbf',
  'Hannover Hbf',
  'Stuttgart Hbf',
  'Köln Hbf',
  'Hamburg Hbf',
  'Berlin Hbf',
  'Düsseldorf Hbf',
  'Mannheim Hbf',
  'Villingen (Schwarzw)',
  'Karlsruhe Hbf',
  'Wuppertal Hbf',
  'Nürnberg Hbf',
  'München Hbf',
  'Bonn Hbf',
  'Leipzig Hbf',
].map(n => n.toLowerCase());

Promise.all(mostUsedNames.map(s => search(s).then(s => s[0]))).then(
  stations => {
    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify(
        stations.map(s => ({
          title: s.title,
          id: s.id,
        }))
      )
    );
  }
);
