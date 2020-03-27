import FavEntry from './FavEntry';
import React from 'react';

const mostUsed = [
  { title: 'Frankfurt (Main) Hbf', id: '8098105' },
  { title: 'Karlsruhe Hbf', id: '8000191' },
  { title: 'Hannover Hbf', id: '8000152' },
  { title: 'Hamburg Hbf', id: '8002549' },
  { title: 'Mannheim Hbf', id: '8000244' },
  { title: 'Berlin Hbf', id: '8011160' },
  { title: 'Stuttgart Hbf', id: '8000096' },
  { title: 'Düsseldorf Hbf', id: '8000085' },
  { title: 'Köln Hbf', id: '8000207' },
  { title: 'Leipzig Hbf', id: '8098205' },
  { title: 'München Hbf', id: '8000261' },
  { title: 'Wuppertal Hbf', id: '8000266' },
  { title: 'Nürnberg Hbf', id: '8000284' },
];

const MostUsed = () => (
  <>
    {mostUsed.map((m) => (
      <FavEntry data-testid="mostUsedEntry" noDelete key={m.id} fav={m} />
    ))}
  </>
);

export default React.memo(MostUsed);
