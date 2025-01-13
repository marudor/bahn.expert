import ErrorIcon from '@mui/icons-material/Error';
import { Stack, css } from '@mui/material';
import { TRPCClientError } from '@trpc/client';
import { useMemo } from 'react';

const ErrorStyle = css`
  width: 80%;
  height: 80%;
  margin: 0 auto;
  text-align: center;
`;

interface Props {
	/**
	 * @deprecated Only used in old error handling
	 */
	error?: unknown;
}

export const Error: FCC<Props> = ({
	error,
	children = 'Unbekannter Fehler',
}) => {
	const errorMessage = useMemo(() => {
		if (error instanceof TRPCClientError) {
			if (error.message === 'NOT_FOUND') {
				return 'Nicht gefunden';
			}
		}
		return children;
	}, [error, children]);
	return (
		<Stack css={ErrorStyle} data-testid="error">
			<ErrorIcon css={ErrorStyle} />
			{errorMessage}
		</Stack>
	);
};
