import { StopPlaceLink } from '@/client/Common/Components/StopPlaceLink';
import type { Stop } from '@/types/iris';
import { useMemo } from 'react';
import type { FC, ReactNode } from 'react';
import { StyledViaStop } from './Normal';

const StyledStopPlaceLink = StyledViaStop.withComponent(StopPlaceLink);

interface Props {
	stops: Stop[];
}
export const DetailVia: FC<Props> = ({ stops }) => {
	const stopsToRender = useMemo(() => {
		const result: ReactNode[] = [];

		for (const [i, s] of stops.entries()) {
			result.push(
				<StyledStopPlaceLink
					stop={s}
					data-testid={`via-${s.name}`}
					key={i}
					stopPlace={{
						name: s.name,
					}}
				/>,
			);
			if (i + 1 !== stops.length) {
				result.push(' - ');
			}
		}

		return result;
	}, [stops]);

	return <>{stopsToRender}</>;
};
