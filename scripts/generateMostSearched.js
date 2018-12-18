// @ƒlow
const rawStations = require('db-stations/data.json');

const mostUsedNames = [
  'Hannover Hbf',
  'Wuppertal Hbf',
  'Düsseldorf Hbf',
  'Hamburg Hbf',
  'Kempen (Niederrhein)',
  'Frankfurt (Main) Hbf',
  'Rheda-Wiedenbrück',
  'Braunschweig Hbf',
  'Köln Hbf',
  'Wolfsburg Hbf',
  'Opladen',
  'Mannheim Hbf',
  'Berlin-Spandau',
  'Duisburg Hbf',
  'München Hbf',
].map(n => n.toLowerCase());

const mostUsedStations = {};

rawStations.forEach(s => {
  if (mostUsedNames.includes(s.name.toLowerCase())) {
    mostUsedStations[s.name.toLowerCase()] = s;
  }
});

// eslint-disable-next-line no-console
console.log(
  JSON.stringify(
    mostUsedNames
      .map(n => mostUsedStations[n])
      .filter(Boolean)
      .map(s => ({
        title: s.name,
        id: s.id,
      }))
  )
);
