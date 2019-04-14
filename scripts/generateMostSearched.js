// @ƒlow
const config = require('../.babelrc.server');

require('@babel/register')(config);

global.PROD = true;
const search = require('../src/server/Search').default;

const mostUsedNames = [
  'Hannover Hbf',
  'Köln Hbf',
  'Düsseldorf Hbf',
  'Wuppertal Hbf',
  'Mannheim Hbf',
  'Frankfurt (Main) Hbf',
  'Hamburg Hbf',
  'Chmenitz Hbf',
  'Berlin Hbf',
  'Rheda-Wiedenbrück',
  'Kempen (Niederrhein)',
  'Stuttgart Hbf',
  'Bonn Hbf',
  'Opladen',
  'Berlin-Spandau',
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
