import { AuslastungsValue } from '@/types/routing';
import { Close, Done, ErrorOutline, Help, Warning } from '@mui/icons-material';
import { styled } from '@mui/material';
import type { FC } from 'react';

function getIcon(auslastung?: AuslastungsValue) {
	switch (auslastung) {
		case AuslastungsValue.Gering: {
			return <Done fontSize="inherit" />;
		}
		case AuslastungsValue.Hoch: {
			return <Warning fontSize="inherit" />;
		}
		case AuslastungsValue.SehrHoch: {
			return <ErrorOutline fontSize="inherit" />;
		}
		case AuslastungsValue.Ausgebucht: {
			return <Close fontSize="inherit" />;
		}
		default: {
			return <Help fontSize="inherit" />;
		}
	}
}

const Container = styled('span')<{ auslastung?: AuslastungsValue }>(
	{
		fontSize: '.7em',
		display: 'inline-block',
		borderRadius: '50%',
		textAlign: 'center',
		padding: '.2em',
		lineHeight: 0,
	},
	{
		variants: [
			{
				props: ({ auslastung }) => auslastung === AuslastungsValue.Gering,
				style: ({ theme }) => ({
					backgroundColor: theme.palette.common.green,
					color: theme.palette.getContrastText(theme.palette.common.green),
				}),
			},
			{
				props: ({ auslastung }) => auslastung === AuslastungsValue.Hoch,
				style: ({ theme }) => ({
					backgroundColor: theme.palette.common.yellow,
					color: theme.palette.getContrastText(theme.palette.common.yellow),
				}),
			},
			{
				props: ({ auslastung }) => auslastung === AuslastungsValue.SehrHoch,
				style: ({ theme }) => ({
					backgroundColor: theme.palette.common.orange,
					color: theme.palette.getContrastText(theme.palette.common.orange),
				}),
			},
			{
				props: ({ auslastung }) => auslastung === AuslastungsValue.Ausgebucht,
				style: ({ theme }) => ({
					backgroundColor: theme.palette.common.red,
					color: theme.palette.getContrastText(theme.palette.common.red),
				}),
			},
		],
	},
);

export interface Props {
	auslastung?: AuslastungsValue;
	className?: string;
}
export const SingleAuslastungsDisplay: FC<Props> = ({
	auslastung,
	className,
}) => {
	return (
		<Container className={className} auslastung={auslastung}>
			{getIcon(auslastung)}
		</Container>
	);
};
