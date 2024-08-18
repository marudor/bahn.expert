import type { CoachSequenceSector } from '@/types/coachSequence';
import { styled } from '@mui/material';
import { useMemo } from 'react';
import type { FC } from 'react';

const Container = styled('div')`
  position: absolute;
  font-weight: bolder;
  text-align: center;
  z-index: 100;
`;

interface Props {
	sector: CoachSequenceSector;
	scale: number;
	correctLeft: number;
}

export const Sector: FC<Props> = ({ sector, correctLeft, scale }) => {
	const position = useMemo(() => {
		const { startPercent, endPercent, cubePosition } = sector.position;

		if (cubePosition) {
			return {
				left: `${(cubePosition - correctLeft) * scale}%`,
			};
		}
		return {
			left: `${(startPercent - correctLeft) * scale}%`,
			width: `${(endPercent - startPercent) * scale}%`,
		};
	}, [correctLeft, scale, sector.position]);

	return <Container style={position}>{sector.name}</Container>;
};
