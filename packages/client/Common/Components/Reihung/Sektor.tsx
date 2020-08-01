import styled, { css } from 'styled-components';
import type { Sektor as SektorType } from 'types/reihung';

interface Props {
  sektor: SektorType;
  scale: number;
  correctLeft: number;
}

const Wrap = styled.div<Props>`
  position: absolute;
  font-weight: bolder;
  text-align: center;
  ${({ sektor, correctLeft, scale }) => {
    const { startprozent, endeprozent } = sektor.positionamgleis;
    const start = Number.parseInt(startprozent, 10);
    const end = Number.parseInt(endeprozent, 10);

    return css`
      left: ${(start - correctLeft) * scale}%;
      width: ${(end - start) * scale}%;
    `;
  }}
`;

export const Sektor = (props: Props) => {
  return <Wrap {...props}>{props.sektor.sektorbezeichnung}</Wrap>;
};
