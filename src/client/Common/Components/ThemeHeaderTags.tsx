import { useTheme } from '@mui/material';
import type { FC } from 'react';
import { Meta } from 'react-head';

export const ThemeHeaderTags: FC = () => {
	const theme = useTheme();

	return (
		<>
			<Meta name="theme-color" content={theme.palette.background.default} />
			<Meta
				name="apple-mobile-web-app-status-bar-style"
				content="black-translucent"
			/>
			<Meta name="apple-mobile-web-app-capable" content="yes" />
		</>
	);
};
