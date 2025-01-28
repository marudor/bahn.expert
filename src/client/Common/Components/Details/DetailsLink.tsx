import { stopPropagation } from '@/client/Common/stopPropagation';
import type { CommonProductInfo } from '@/types/journey';
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
	const baseProps = {
		className,
		'data-testid': 'detailsLink',
		onClick: stopPropagation,
	};
	const trainName = `${train.type} ${train.number}`;
	if (journeyId) {
		return (
			<Link
				{...baseProps}
				to="/details/$train/j/$journeyId"
				params={{
					train: trainName,
					journeyId,
				}}
			>
				{children}
			</Link>
		);
	}

	return (
		<Link
			{...baseProps}
			to="/details/$train/$initialDeparture"
			params={{
				train: trainName,
				initialDeparture: initialDeparture.toISOString(),
			}}
			search={{
				evaNumberAlongRoute,
				jid,
			}}
		>
			{children}
		</Link>
	);
};
