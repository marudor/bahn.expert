import type { CommonProductInfo } from '@/types/HAFAS';
import type { FC } from 'react';

type FTNPropsFallback = {
	train?: CommonProductInfo;
	fallback: string;
};

type FTNProps = {
	train: CommonProductInfo;
	fallback?: string;
};

type Props = FTNProps | FTNPropsFallback;

export const FullTrainName: FC<Props> = ({ train, fallback }) => {
	if (!train) {
		return <span>{fallback}</span>;
	}
	const usesNumberAsIdentification =
		train.number && train.name.endsWith(train.number);
	return (
		<span data-testid="detailsTrainName">
			{train.name}
			{!usesNumberAsIdentification && ` (${train.number})`}
		</span>
	);
};
