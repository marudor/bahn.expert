import { SingleAuslastungsDisplay } from '@/client/Common/Components/SingleAuslastungsDisplay';
import type { RouteAuslastungWithSource } from '@/types/routing';
import { Stack, styled } from '@mui/material';
import type { ComponentProps, FC } from 'react';

const Container = styled('div')<{ oneLine?: boolean }>(
	{
		fontSize: '.75em',
		display: 'flex',
	},
	({ oneLine }) =>
		!oneLine && {
			flexDirection: 'column',
		},
);

const Seperator = styled('span')`
  margin: 0 0.25em;
`;

const Source: FC<{
	source: RouteAuslastungWithSource['source'];
}> = ({ source }) => {
	if (source && process.env.NODE_ENV !== 'production') {
		return ` (${source})`;
	}
};

export interface Props extends ComponentProps<'div'> {
	auslastung: RouteAuslastungWithSource;
	oneLine?: boolean;
}

export const AuslastungsDisplay: FC<Props> = ({
	auslastung,
	oneLine,
	...rest
}) => {
	if (!auslastung.occupancy.first && !auslastung.occupancy.second) {
		return null;
	}
	return (
		<Container oneLine={oneLine} data-testid="auslastungDisplay" {...rest}>
			Auslastung
			<Source source={auslastung.source} />
			<Stack direction="row" marginLeft=".2em" component="span">
				<div data-testid="first">
					1.{' '}
					<SingleAuslastungsDisplay auslastung={auslastung.occupancy.first} />
				</div>
				<Seperator>|</Seperator>
				<div data-testid="second">
					2.{' '}
					<SingleAuslastungsDisplay auslastung={auslastung.occupancy.second} />
				</div>
			</Stack>
		</Container>
	);
};
