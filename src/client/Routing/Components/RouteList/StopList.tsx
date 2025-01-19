import { Stop } from '@/client/Common/Components/Details/Stop';
import type { RouteStop } from '@/types/routing';
import { styled } from '@mui/material';
import type { FC } from 'react';

const Container = styled('div')`
  padding-left: 0.2em;
`;
interface Props {
	stops?: RouteStop[];
}

export const StopList: FC<Props> = ({ stops }) => {
	return stops ? (
		<Container>
			{stops.map((s) => (
				<Stop key={s.station.evaNumber} stop={s} />
			))}
		</Container>
	) : null;
};
