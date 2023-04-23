import { stopPropagation } from '@/client/Common/stopPropagation';
import type {
  AvailableIdentifier,
  CoachSequenceBaureihe,
} from '@/types/coachSequence';
import type { FC } from 'react';

interface Props {
  br: CoachSequenceBaureihe;
  className?: string;
}

const identifierWithPDF = new Set<AvailableIdentifier>([
  '401',
  '401.LDV',
  '402',
  '403.R',
  '403.S1',
  '403.S2',
  '406',
  '406.R',
  '407',
  '408',
  '411.S1',
  '411.S2',
  '412.7',
  '412',
  '412.13',
  '415',
  '4110',
  'IC2.TRE',
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
