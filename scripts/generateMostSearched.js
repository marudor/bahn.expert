/* eslint-disable unicorn/prefer-module */
const axios = require('axios');

const search = async (searchTerm) => {
  const r = await axios.get(
    `https://bahn.expert/api/stopPlace/v1/search/${searchTerm}`,
  );
  return r.data;
};

const mostUsedNames = [
  'Frankfurt (Main) Hbf',
  'Karlsruhe Hbf',
  'Dortmund Hbf',
  'Regensburg Hbf',
  'Köln Hbf',
  'Hamburg Hbf',
  'Berlin Hbf',
  'Hannover Hbf',
  'München Hbf',
  'Düsseldorf Hbf',
  'Stuttgart Hbf',
  'Nürnberg Hbf',
  'Mannheim Hbf',
  'Dresden Hbf',
].map((n) => n.toLowerCase());

Promise.all(mostUsedNames.map((s) => search(s).then((s) => s[0]))).then(
  (stopPlaces) => {
    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify(
        stopPlaces.map((s) => ({
          evaNumber: s.evaNumber,
          name: s.name,
        })),
      ),
    );
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
  },
);
