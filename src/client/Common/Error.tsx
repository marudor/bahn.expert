import ErrorIcon from '@mui/icons-material/Error';
import { Stack, css } from '@mui/material';
import { TRPCClientError } from '@trpc/client';
import { type FC, useMemo } from 'react';

const ErrorStyle = css`
  width: 80%;
  height: 80%;
  margin: 0 auto;
  text-align: center;
`;

interface Props {
	error: unknown;
	context: string;
}

export const Error: FC<Props> = ({ error, context }) => {
	const errorText = useMemo(() => {
		if (error instanceof TRPCClientError) {
			switch (error.message) {
				case 'NOT_FOUND':
					return `Unbekannter ${context}`;
			}
		}
		return 'Unbekannter Fehler';
	}, [error, context]);

	return (
		<Stack css={ErrorStyle} data-testid="error">
			<ErrorIcon css={ErrorStyle} />
			{errorText}
		</Stack>
	);
};
