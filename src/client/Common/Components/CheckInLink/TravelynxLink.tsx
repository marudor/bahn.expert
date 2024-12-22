import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import { stopPropagation } from '@/client/Common/stopPropagation';
import type { CommonProductInfo, CommonStopInfo } from '@/types/HAFAS';
import { SvgIcon, Tooltip } from '@mui/material';
import { addMinutes, isBefore } from 'date-fns';
import type { FC } from 'react';

const TravelynxIcon: FC = () => (
	<SvgIcon viewBox="0 0 180 180" fontSize="medium">
		<path
			d="M8.427 1.305c-3.062 0-6.123.383-6.123 3.061v7.271a2.682 2.682 0 0 0 2.679 2.679l-1.148 1.148v.383h1.706l1.531-1.531h2.885l1.531 1.531h1.531v-.383l-1.148-1.148a2.681 2.681 0 0 0 2.678-2.679V4.366c0-2.678-2.74-3.061-6.122-3.061Zm-3.444 11.48a1.146 1.146 0 0 1-1.148-1.148c0-.635.512-1.148 1.148-1.148a1.147 1.147 0 1 1 0 2.296Zm2.678-5.357H3.835V4.366h3.826v3.062Zm1.531 0V4.366h3.827v3.062H9.192Zm2.679 5.357a1.146 1.146 0 0 1-1.148-1.148c0-.635.512-1.148 1.148-1.148a1.147 1.147 0 1 1 0 2.296ZM13.209 20.997l-3.591-3.59-1.222 1.214 4.813 4.813 10.332-10.332-1.214-1.214-9.118 9.109Z"
			transform="translate(4.812 8.457) scale(6.59229)"
		/>
	</SvgIcon>
);

interface Props {
	departure?: CommonStopInfo;
	arrival?: CommonStopInfo;
	evaNumber: string;
	train: CommonProductInfo;
	className?: string;
}

export const TravelynxLink: FC<Props> = ({
	departure,
	arrival,
	evaNumber,
	train,
	className,
}) => {
	const { hideTravelynx } = useCommonConfig();

	if (!train.type || !train.number || train.number === '0') {
		return null;
	}

	return !hideTravelynx &&
		departure &&
		!departure.cancelled &&
		isBefore(
			arrival ? arrival.scheduledTime : departure.scheduledTime,
			addMinutes(Date.now(), 30),
		) ? (
		<Tooltip title="travelynx">
			<a
				data-testid="travellynxlink"
				className={className}
				onClick={stopPropagation}
				rel="noopener noreferrer"
				target="_blank"
				href={`https://travelynx.de/s/${evaNumber}?train=${train.type} ${train.number}`}
			>
				<TravelynxIcon />
			</a>
		</Tooltip>
	) : null;
};
