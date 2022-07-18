import { Stop } from 'client/Common/Components/Details/Stop';
import styled from '@emotion/styled';
import type { FC } from 'react';
import type { Route$Stop } from 'types/routing';

const Container = styled.div`
  padding-left: 0.2em;
`;
interface Props {
  stops?: Route$Stop[];
}

export const StopList: FC<Props> = ({ stops }) => {
  return stops ? (
    <Container>
      {stops.map((s) => (
        <Stop doNotRenderOccupancy key={s.station.id} stop={s} />
      ))}
    </Container>
  ) : null;
};
