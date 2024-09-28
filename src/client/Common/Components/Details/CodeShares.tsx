import type { CodeShare } from '@/external/generated/risJourneysV2';
import { Stack } from '@mui/material';
import type { FC } from 'react';

interface Props {
	codeShares?: CodeShare[];
}

export const CodeShares: FC<Props> = ({ codeShares }) => {
	if (!codeShares) {
		return null;
	}
	return (
		<Stack>
			{codeShares.map((c) => (
				<div key={c.flightnumber}>
					✈ {c.airlineCode} {c.flightnumber}
				</div>
			))}
		</Stack>
	);
};
