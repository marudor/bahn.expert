import { useUnfavAction } from '@/client/Abfahrten/hooks/useFavs';
import type { MinimalStopPlace } from '@/types/stopPlace';
import Delete from '@mui/icons-material/Delete';
import { IconButton, Paper, styled } from '@mui/material';
import { Link } from '@tanstack/react-router';
import { useCallback } from 'react';
import type { FC, MouseEvent, ReactNode } from 'react';

const BasePaper = styled(Paper)(({ theme }) => ({
	minHeight: 48,
	marginBottom: 1,
	flexShrink: 0,
	fontSize: '1.6em',
	padding: '0 .5em',
	color: theme.vars.palette.text.primary,
	display: 'flex',
	alignItems: 'center',
	[theme.breakpoints.up('sm')]: {
		fontSize: '2rem',
	},
	'&>a': {
		color: theme.vars.palette.text.primary,
	},
	wordBreak: 'break-word',
}));

const ClickablePaper = styled(BasePaper)(({ theme }) => ({
	'&:hover': {
		backgroundColor: theme.vars.palette.action.hover,
	},
	justifyContent: 'space-between',
}));

const UnclickablePaper = styled(BasePaper)`
  font-weight: 600;
  justify-content: center;
`;

interface Props {
	fav: MinimalStopPlace;
	favKey?: 'regionalFavs' | 'favs';
	'data-testid'?: string;
}

interface FavEntryDisplayProps {
	deleteFav?: (e: MouseEvent) => void;
	text: ReactNode;
	'data-testid'?: string;
	nonClickable?: boolean;
}
export const FavEntryDisplay: FC<FavEntryDisplayProps> = ({
	deleteFav,
	text,
	nonClickable,
	'data-testid': testid,
}) => {
	const PaperWrap = nonClickable ? UnclickablePaper : ClickablePaper;
	return (
		<PaperWrap data-testid={testid} square>
			<span>{text}</span>
			{deleteFav && (
				<IconButton
					data-testid="deleteFav"
					aria-label={`${text} entfernen`}
					onClick={deleteFav}
					color="inherit"
				>
					<Delete />
				</IconButton>
			)}
		</PaperWrap>
	);
};

export const FavEntry: FC<Props> = ({
	fav,
	'data-testid': testid = 'favEntry',
	favKey,
}) => {
	const unfav = useUnfavAction(favKey);
	const deleteFav = useCallback(
		(e: MouseEvent) => {
			e.stopPropagation();
			e.preventDefault();
			unfav?.(fav);
		},
		[fav, unfav],
	);

	return (
		<Link
			data-testid={testid}
			to="/$stopPlace"
			params={{
				stopPlace: encodeURIComponent(fav.name),
			}}
			title={`Zugabfahrten für ${fav.name}`}
		>
			<FavEntryDisplay
				text={fav.name}
				deleteFav={favKey ? deleteFav : undefined}
			/>
		</Link>
	);
};
