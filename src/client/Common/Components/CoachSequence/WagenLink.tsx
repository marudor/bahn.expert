import { css } from '@emotion/react';
import { stopPropagation } from '@/client/Common/stopPropagation';
import { useMemo } from 'react';
import type {
  AvailableIdentifier,
  CoachSequenceCoach,
} from '@/types/coachSequence';
import type { FC } from 'react';

const linkCss = css`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
`;

interface Props {
  fahrzeug: CoachSequenceCoach;
  identifier?: AvailableIdentifier;
  type: string;
}

const wagenWithImage = new Set([
  'ARkimbz',
  'ARkimmbz',
  'Apmmz',
  'Avmmz',
  'Avmz',
  'Bimmdzf',
  'Bpmbz',
  'Bpmmbdz',
  'Bpmmbdzf',
  'Bpmmbz',
  'Bpmmdz',
  'Bpmmz',
  'Bvmmsz',
  'Bvmmz',
  'Bvmsz',
  'DApza',
  'DBpza',
  'DBpbzfa',
]);

const allowedTypes = new Set(['IC', 'ICE']);

const seriesRegex = /\.S(\d)/;

export const WagenLink: FC<Props> = ({ fahrzeug, identifier, type }) => {
  const imageName = useMemo(() => {
    if (
      !allowedTypes.has(type) ||
      fahrzeug.vehicleCategory === 'POWERCAR' ||
      fahrzeug.vehicleCategory === 'LOCOMOTIVE'
    ) {
      return;
    }
    if (
      (!identifier || identifier === 'IC2.TRE') &&
      fahrzeug.type &&
      wagenWithImage.has(fahrzeug.type)
    ) {
      return fahrzeug.type;
    }

    if (
      identifier &&
      identifier !== 'TGV' &&
      identifier !== 'MET' &&
      identifier !== '408' &&
      fahrzeug.uic
    ) {
      let relevantUIC = fahrzeug.uic.slice(4, 9);
      if (identifier.endsWith('R')) {
        relevantUIC += '.r';
      } else if (identifier.includes('.S')) {
        // @ts-expect-error this works
        relevantUIC += `.${seriesRegex.exec(identifier)[1]}`;
      }
      return relevantUIC;
    }
  }, [fahrzeug.vehicleCategory, fahrzeug.type, fahrzeug.uic, identifier, type]);

  if (!imageName) {
    return (
      <span data-testid="coachType" css={linkCss}>
        {fahrzeug.type}
      </span>
    );
  }

  return (
    <a
      data-testid="coachType"
      css={linkCss}
      onClick={stopPropagation}
      href={`https://lib.finalrewind.org/dbdb/db_wagen/${imageName}.png`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {fahrzeug.type}
    </a>
  );
};
