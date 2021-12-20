import { useMemo } from 'react';
import styled from '@emotion/styled';
import type { CoachSequenceSector } from 'types/coachSequence';
import type { FC } from 'react';

const Container = styled.div`
  position: absolute;
  font-weight: bolder;
  text-align: center;
`;

interface Props {
  sector: CoachSequenceSector;
  scale: number;
  correctLeft: number;
}

export const Sektor: FC<Props> = ({ sector, correctLeft, scale }) => {
  const position = useMemo(() => {
    const { startPercent, endPercent } = sector.position;

    return {
      left: `${(startPercent - correctLeft) * scale}%`,
      width: `${(endPercent - startPercent) * scale}%`,
    };
  }, [correctLeft, scale, sector.position]);
  return <Container style={position}>{sector.name}</Container>;
};
