import FavEntry from './FavEntry';
import React from 'react';

const mostUsed = [
  { title: 'Hannover Hbf', id: '8000152' },
  { title: 'Köln Hbf', id: '8000207' },
  { title: 'Düsseldorf Hbf', id: '8000085' },
  { title: 'Wuppertal Hbf', id: '8000266' },
  { title: 'Mannheim Hbf', id: '8000244' },
  { title: 'Frankfurt (Main) Hbf', id: '8098105' },
  { title: 'Hamburg Hbf', id: '8002549' },
  { title: 'Chemnitz Hbf', id: '8010184' },
  { title: 'Berlin Hauptbahnhof', id: '8011160' },
  { title: 'Rheda-Wiedenbrück', id: '8000315' },
  { title: 'Kempen (Niederrhein)', id: '8000409' },
  { title: 'Stuttgart Hbf', id: '8000096' },
  { title: 'Bonn Hbf', id: '8000044' },
  { title: 'Opladen', id: '8000853' },
  { title: 'Berlin-Spandau', id: '8010404' },
];

// eslint-disable-next-line react/display-name
const MostUsed = () => (
  <>
    {mostUsed.map(m => (
      <FavEntry noDelete key={m.id} fav={m} />
    ))}
  </>
);

export default React.memo(MostUsed);
