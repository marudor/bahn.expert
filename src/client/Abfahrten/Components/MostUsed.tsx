import { FavEntry } from './FavEntry';
import type { FC } from 'react';

const mostUsed = [
  { name: 'Frankfurt(Main)Hbf', evaNumber: '8000105' },
  { name: 'Karlsruhe Hbf', evaNumber: '8000191' },
  { name: 'Stuttgart Hbf', evaNumber: '8000096' },
  { name: 'Hamburg Hbf', evaNumber: '8002549' },
  { name: 'Hannover Hbf', evaNumber: '8000152' },
  { name: 'Düsseldorf Hbf', evaNumber: '8000085' },
  { name: 'Köln Hbf', evaNumber: '8000207' },
  { name: 'Berlin Hbf', evaNumber: '8011160' },
  { name: 'Mannheim Hbf', evaNumber: '8000244' },
  { name: 'München Hbf', evaNumber: '8000261' },
  { name: 'Nürnberg Hbf', evaNumber: '8000284' },
  { name: 'Ulm Hbf', evaNumber: '8000170' },
];

export const MostUsed: FC = () => (
  <>
    {mostUsed.map((m) => (
      <FavEntry
        data-testid="mostUsedEntry"
        noDelete
        key={m.evaNumber}
        fav={m}
      />
    ))}
  </>
);
