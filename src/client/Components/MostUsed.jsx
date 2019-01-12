// @flow
import FavEntry from './FavEntry';
import React from 'react';

const mostUsed = [
  { title: 'Hannover Hbf', id: '8000152' },
  { title: 'Wuppertal Hbf', id: '8000266' },
  { title: 'Düsseldorf Hbf', id: '8000085' },
  { title: 'Hamburg Hbf', id: '8002549' },
  { title: 'Kempen (Niederrhein)', id: '8000409' },
  { title: 'Frankfurt (Main) Hbf', id: '8000105' },
  { title: 'Rheda-Wiedenbrück', id: '8000315' },
  { title: 'Braunschweig Hbf', id: '8000049' },
  { title: 'Köln Hbf', id: '8000207' },
  { title: 'Wolfsburg Hbf', id: '8006552' },
  { title: 'Opladen', id: '8000853' },
  { title: 'Mannheim Hbf', id: '8000244' },
  { title: 'Berlin-Spandau', id: '8010404' },
  { title: 'Duisburg Hbf', id: '8000086' },
  { title: 'München Hbf', id: '8000261' },
];

// eslint-disable-next-line react/display-name
export default () => (
  <>
    {mostUsed.map(m => (
      <FavEntry noDelete key={m.id} fav={m} />
    ))}
  </>
);
