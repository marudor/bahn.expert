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
	reverse: boolean;
}

export const Sector: FC<Props> = ({ sector, correctLeft, scale, reverse }) => {
	const position = useMemo(() => {
		const { startPercent, endPercent, cubePosition } = sector.position;
		const cssName = reverse ? 'right' : 'left';

		if (cubePosition) {
			return {
				[cssName]: `${(cubePosition - correctLeft) * scale}%`,
			};
		}
		return {
			[cssName]: `${(startPercent - correctLeft) * scale}%`,
			width: `${(endPercent - startPercent) * scale}%`,
		};
	}, [correctLeft, scale, sector.position, reverse]);

	return <Container style={position}>{sector.name}</Container>;
};
