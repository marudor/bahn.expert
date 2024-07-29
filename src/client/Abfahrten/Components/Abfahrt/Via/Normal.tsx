import { themeMixins } from '@/client/Themes/mixins';
import type { Stop } from '@/types/iris';
import { styled } from '@mui/material';
import { useMemo } from 'react';
import type { FC, ReactNode } from 'react';
import { isHbf } from './index';

export const StyledViaStop = styled('span', {
	shouldForwardProp: (p) => p !== 'stop',
})<{ stop: Stop }>(({ theme, stop }) => ({
	color: theme.palette.text.primary,
	...(isHbf(stop) && {
		fontWeight: 'bold',
	}),
	...(stop.cancelled && {
		...themeMixins.cancelled(theme),
		...themeMixins.changed(theme),
	}),
	...(stop.additional && themeMixins.additional(theme)),
}));

interface Props {
	stops: Stop[];
}
export const NormalVia: FC<Props> = ({ stops }) => {
	const stopsToRender = useMemo(() => {
		const stopsToRender: ReactNode[] = [];
		const filteredStops = stops.filter((s) => s.showVia);

		for (const [i, s] of filteredStops.entries()) {
			stopsToRender.push(
				<StyledViaStop stop={s} data-testid={`via-${s.name}`} key={i}>
					{s.name}
				</StyledViaStop>,
			);
			if (i + 1 !== filteredStops.length) {
				stopsToRender.push(' - ');
			}
		}

		return stopsToRender;
	}, [stops]);

	return <>{stopsToRender}</>;
};
