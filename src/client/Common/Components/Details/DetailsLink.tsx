import { stopPropagation } from '@/client/Common/stopPropagation';
import type { CommonProductInfo } from '@/types/HAFAS';
import { Link } from '@tanstack/react-router';
import type { FC, PropsWithChildren } from 'react';

interface Props {
	train: Pick<CommonProductInfo, 'type' | 'number'>;
	evaNumberAlongRoute?: string;
	initialDeparture: Date;
	journeyId?: string;
	jid?: string;
	className?: string;
	'data-testid'?: string;
}
export const DetailsLink: FC<PropsWithChildren<Props>> = ({
	train,
	evaNumberAlongRoute,
	initialDeparture,
	journeyId,
	jid,
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
			to="/details/$train/$initialDeparture"
			params={{
				train: `${train.type} ${train.number}`,
				initialDeparture: initialDeparture.toISOString(),
			}}
			search={{
				evaNumberAlongRoute,
				journeyId,
				jid,
			}}
		>
			{children}
		</Link>
	);
};
