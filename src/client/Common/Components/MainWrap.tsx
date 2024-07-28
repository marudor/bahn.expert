import { Stack } from '@mui/material';
import type { FC, ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

export const MainWrap: FC<Props> = ({ children }) => {
	return <Stack>{children}</Stack>;
};
