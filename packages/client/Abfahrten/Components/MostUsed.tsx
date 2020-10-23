import { FavEntry } from './FavEntry';
import type { FC } from 'react';

const mostUsed = [
  { title: 'Frankfurt(Main)Hbf', id: '8000105' },
  { title: 'Karlsruhe Hbf', id: '8000191' },
  { title: 'Braunschweig Hbf', id: '8000049' },
  { title: 'Stuttgart Hbf', id: '8000096' },
  { title: 'Hannover Hbf', id: '8000152' },
  { title: 'Köln Hbf', id: '8000207' },
  { title: 'Berlin Hbf', id: '8011160' },
  { title: 'Hamburg Hbf', id: '8002549' },
  { title: 'Mannheim Hbf', id: '8000244' },
  { title: 'Düsseldorf Hbf', id: '8000085' },
  { title: 'München Hbf', id: '8000261' },
  { title: 'Nürnberg Hbf', id: '8000284' },
  { title: 'Ulm Hbf', id: '8000170' },
];

export const MostUsed: FC = () => (
  <>
    {mostUsed.map((m) => (
      <FavEntry data-testid="mostUsedEntry" noDelete key={m.id} fav={m} />
    ))}
  </>
);
