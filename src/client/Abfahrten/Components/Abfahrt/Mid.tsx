import { Info } from './Info';
import { useAbfahrt } from '@/client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import styled from '@emotion/styled';
import type { FC } from 'react';

const Wrapper = styled.div<{ detail: boolean }>(({ detail }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  justifyContent: 'space-around',
  overflow: 'hidden',
  whiteSpace: !detail ? 'nowrap' : undefined,
}));

const Destination = styled.div<{
  cancelled?: boolean;
  different?: boolean;
}>(
  {
    fontSize: '4em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  ({ theme, cancelled }) => cancelled && theme.mixins.cancelled,
  ({ theme, different }) => different && theme.mixins.changed,
);

export const Mid: FC = () => {
  const { abfahrt, detail } = useAbfahrt();
  return (
    <Wrapper detail={detail} data-testid="abfahrtMid">
      <Info />
      <Destination
        cancelled={abfahrt.cancelled}
        different={
          !abfahrt.cancelled &&
          abfahrt.destination !== abfahrt.scheduledDestination
        }
        data-testid="destination"
      >
        {abfahrt.cancelled ? abfahrt.scheduledDestination : abfahrt.destination}
      </Destination>
    </Wrapper>
  );
};
