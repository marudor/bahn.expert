import { css } from '@emotion/react';
import { isHbf } from './index';
import { useMemo } from 'react';
import styled from '@emotion/styled';
import type { FC, ReactNode } from 'react';
import type { Stop } from 'types/iris';

export const StyledViaStop = styled.span<{ stop: Stop }>(({ theme, stop }) => ({
  color: theme.palette.text.primary,
  ...(isHbf(stop) && {
    fontWeight: 'bold',
  }),
  ...(stop.cancelled &&
    css`
      ${theme.mixins.cancelled};
      ${theme.mixins.changed};
    `),
  ...(stop.additional && theme.mixins.additional),
}));

interface Props {
  stops: Stop[];
}
export const NormalVia: FC<Props> = ({ stops }) => {
  const stopsToRender = useMemo(() => {
    const stopsToRender: ReactNode[] = [];
    const filteredStops = stops.filter((s) => s.showVia);

    filteredStops.forEach((s, i) => {
      stopsToRender.push(
        <StyledViaStop stop={s} data-testid={`via-${s.name}`} key={i}>
          {s.name}
        </StyledViaStop>,
      );
      if (i + 1 !== filteredStops.length) {
        stopsToRender.push(' - ');
      }
    });

    return stopsToRender;
  }, [stops]);

  return <>{stopsToRender}</>;
};
