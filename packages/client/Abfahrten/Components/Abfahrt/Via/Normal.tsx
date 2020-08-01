import { additionalCss, cancelledCss, changedCss } from 'client/util/cssUtils';
import { isHbf } from './index';
import { ReactNode, useMemo } from 'react';
import styled, { css } from 'styled-components';
import type { Stop } from 'types/iris';

export const ViaStop = styled.span<{ stop: Stop }>`
  color: ${({ theme }) => theme.palette.text.primary};
  ${({ stop }) => [
    stop.cancelled &&
      css`
        ${cancelledCss};
        ${changedCss}
      `,
    stop.additional && additionalCss,
    isHbf(stop) &&
      css`
        font-weight: bold;
      `,
  ]}
`;

interface Props {
  stops: Stop[];
}
export const NormalVia = ({ stops }: Props) => {
  const stopsToRender = useMemo(() => {
    const stopsToRender: ReactNode[] = [];
    const filteredStops = stops.filter((s) => s.showVia);

    filteredStops.forEach((s, i) => {
      stopsToRender.push(
        <ViaStop stop={s} data-testid={`via-${s.name}`} key={i}>
          {s.name}
        </ViaStop>
      );
      if (i + 1 !== filteredStops.length) {
        stopsToRender.push(' - ');
      }
    });

    return stopsToRender;
  }, [stops]);

  return <>{stopsToRender}</>;
};
