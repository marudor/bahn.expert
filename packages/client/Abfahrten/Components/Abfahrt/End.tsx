import Platform from 'client/Common/Components/Platform';
import styled from 'styled-components/macro';
import Times from './Times';
import type { Abfahrt } from 'types/iris';

const Wrap = styled.div`
  font-size: 2.5em;
  align-items: flex-end;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 1em;
`;

interface Props {
  abfahrt: Abfahrt;
  detail: boolean;
}
const End = ({ abfahrt, detail }: Props) => (
  <Wrap data-testid="abfahrtEnd">
    <Times abfahrt={abfahrt} detail={detail} />
    <Platform
      real={abfahrt.platform}
      scheduled={abfahrt.scheduledPlatform}
      cancelled={abfahrt.cancelled}
    />
  </Wrap>
);

export default End;
