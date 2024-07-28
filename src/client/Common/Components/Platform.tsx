import { themeMixins } from '@/client/Themes/mixins';
import { styled } from '@mui/material';
import type { FC } from 'react';

const Container = styled('div')<{ cancelled?: boolean; changed?: boolean }>(
	({ theme, cancelled }) => cancelled && themeMixins.cancelled(theme),
	({ theme, changed }) => changed && themeMixins.changed(theme),
);

const ChangedContainer = styled('span')(
	({ theme }) => themeMixins.cancelled(theme),
	{
		paddingLeft: '.3em',
	},
);

interface Props {
	cancelled?: boolean;
	scheduled?: string;
	real?: string;
	className?: string;
}

export const Platform: FC<Props> = ({
	cancelled,
	scheduled,
	real,
	className,
}) => {
	const changed = Boolean(scheduled && scheduled !== real);

	return (
		<Container
			className={className}
			data-testid="platform"
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
