import { stopPropagation } from '@/client/Common/stopPropagation';
import type { CommonProductInfo } from '@/types/HAFAS';
import qs from 'qs';
import type { FC, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

interface Props {
	train: Pick<CommonProductInfo, 'type' | 'number'>;
	evaNumberAlongRoute?: string;
	initialDeparture: Date;
	journeyId?: string;
	urlPrefix?: string;
	jid?: string;
	className?: string;
}
export const DetailsLink: FC<PropsWithChildren<Props>> = ({
	train,
	evaNumberAlongRoute,
	initialDeparture,
	journeyId,
	jid,
	urlPrefix = '/',
	children = 'Details',
	className,
}) => {
	if (!train.number || !train.type) {
		return null;
	}
	return (
		<Link
			className={className}
			data-testid="detailsLink"
			onClick={stopPropagation}
			to={`${urlPrefix}details/${train.type} ${
				train.number
			}/${initialDeparture.toISOString()}${qs.stringify(
				{
					evaNumberAlongRoute,
					journeyId,
					jid,
				},
				{
					addQueryPrefix: true,
				},
			)}`}
		>
			{children}
		</Link>
	);
};
