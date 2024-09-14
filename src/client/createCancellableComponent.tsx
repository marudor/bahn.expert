import { styled } from '@mui/material';
import type { FC } from 'react';

export function createCancellableComponent<T>(component: FC<T>) {
	return styled(component)<{ cancelled?: boolean }>({
		variants: [
			{
				props: { cancelled: true },
				style: ({ theme }) => theme.mixins.cancelled,
			},
		],
	});
}
