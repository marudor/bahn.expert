import { css, styled } from '@mui/material';
import type { FC } from 'react';

const Container = styled('span')(
	({ theme }) => css`
    background-color: ${theme.vars.palette.text.primary};
    width: 50%;
    height: 2px;
    position: absolute;
    left: 50%;
    bottom: 0.5em;
    z-index: 10;
    transform: translateX(-50%);
  `,
);

const Arrow = styled('span')(
	({ theme }) => css`
    border: solid ${theme.vars.palette.text.primary};
    border-width: 0 2px 2px 0;
    display: inline-block;
    padding: 3px;
    position: absolute;
    top: -3px;
  `,
);

const LeftArrow = styled(Arrow)`
  transform: rotate(135deg);
`;

interface Props {
	reversed?: boolean;
}

export const DirectionOfTravel: FC<Props> = () => {
	return (
		<Container data-testid="direction">
			<LeftArrow data-testid="left" />
		</Container>
	);
};
