import { useAbfahrt } from '@/client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { Platform } from '@/client/Common/Components/Platform';
import { Stack } from '@mui/material';
import type { FC } from 'react';
import { Times } from './Times';

export const End: FC = () => {
	const { abfahrt } = useAbfahrt();
	return (
		<Stack
			data-testid="abfahrtEnd"
			alignItems="flex-end"
			justifyContent="space-between"
			marginLeft={1}
			fontSize="2.5em"
		>
			<Times />
			<Platform
				real={abfahrt.platform}
				scheduled={abfahrt.scheduledPlatform}
				cancelled={abfahrt.cancelled}
			/>
		</Stack>
	);
};
