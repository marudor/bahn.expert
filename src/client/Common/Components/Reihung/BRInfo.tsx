import { stopPropagation } from 'client/Common/stopPropagation';
import type { CoachSequenceBaureihe } from 'types/coachSequence';
import type { FC } from 'react';

interface Props {
  br: CoachSequenceBaureihe;
  className?: string;
}

const identifierWithPDF = new Set([
  '401',
  '402',
  '403.R',
  '403.S1',
  '403.S2',
  '406',
  '406.R',
  '407',
  '411.S1',
  '411.S2',
  '412',
  '415',
  'IC2.KISS',
  'IC2.TWIN',
  'MET',
]);

export const BRInfo: FC<Props> = ({ br, className }) => {
  if (!identifierWithPDF.has(br.identifier))
    return <span className={className}>{br.name}</span>;

  return (
    <a
      className={className}
      onClick={stopPropagation}
      target="_blank"
      rel="noopener noreferrer"
      href={`/WRSheets/${br.identifier}.pdf`}
    >
      {br.name}
    </a>
  );
};
