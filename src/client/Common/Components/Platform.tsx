import { styled } from '@mui/material';
import type { FC } from 'react';

const Container = styled('div')<{ cancelled?: boolean; changed?: boolean }>({
	variants: [
		{
			props: { cancelled: true },
			style: ({ theme }) => theme.mixins.cancelled,
		},
		{
			props: { changed: true },
			style: ({ theme }) => theme.mixins.changed,
		},
	],
});

const ChangedContainer = styled('span')(({ theme }) => theme.mixins.cancelled, {
	paddingLeft: '.3em',
});

interface Props {
	cancelled?: boolean;
	scheduled?: string;
	real?: string;
	className?: string;
	'data-testid'?: string;
}

export const Platform: FC<Props> = ({
	cancelled,
	scheduled,
	real,
	className,
	'data-testid': dataTestid = 'platform',
}) => {
	const changed = Boolean(scheduled && scheduled !== real);

	return (
		<Container
			className={className}
			data-testid={dataTestid}
			cancelled={cancelled}
			changed={changed}
		>
			<span data-testid="real">{real}</span>
			{changed && (
				<ChangedContainer data-testid="scheduled">
					({scheduled})
				</ChangedContainer>
			)}
		</Container>
	);
};
