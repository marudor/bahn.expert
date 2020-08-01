import { cancelledCss, changedCss } from 'client/util/cssUtils';
import { Info } from './Info';
import styled, { css } from 'styled-components';
import type { Abfahrt } from 'types/iris';

const Destination = styled.div<{ cancelled?: boolean; different?: boolean }>`
  font-size: 4em;
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ cancelled, different }) => [
    cancelled && cancelledCss,
    different && changedCss,
  ]}
`;

const Wrap = styled.div<{ detail?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-around;
  overflow: hidden;
  ${({ detail }) =>
    !detail &&
    css`
      white-space: nowrap;
    `}
`;

interface Props {
  abfahrt: Abfahrt;
  detail: boolean;
}

export const Mid = ({ abfahrt, detail }: Props) => (
  <Wrap detail={detail} data-testid="abfahrtMid">
    <Info abfahrt={abfahrt} detail={detail} />
    <Destination
      cancelled={abfahrt.cancelled}
      different={
        !abfahrt.cancelled &&
        abfahrt.destination !== abfahrt.scheduledDestination
      }
    >
      {abfahrt.cancelled ? abfahrt.scheduledDestination : abfahrt.destination}
    </Destination>
  </Wrap>
);
