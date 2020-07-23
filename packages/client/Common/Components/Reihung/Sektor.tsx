import styled, { css } from 'styled-components/macro';
import type { Sektor } from 'types/reihung';

interface Props {
  sektor: Sektor;
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

const SektorComp = (props: Props) => {
  return <Wrap {...props}>{props.sektor.sektorbezeichnung}</Wrap>;
};

export default SektorComp;
