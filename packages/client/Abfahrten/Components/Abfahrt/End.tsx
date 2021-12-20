import { Platform } from 'client/Common/Components/Platform';
import { Times } from './Times';
import { useAbfahrt } from 'client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import styled from '@emotion/styled';
import type { FC } from 'react';

const Container = styled.div`
  font-size: 2.5em;
  align-items: flex-end;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 1em;
`;

export const End: FC = () => {
  const { abfahrt } = useAbfahrt();
  return (
    <Container data-testid="abfahrtEnd">
      <Times />
      <Platform
        real={abfahrt.platform}
        scheduled={abfahrt.scheduledPlatform}
        cancelled={abfahrt.cancelled}
      />
    </Container>
  );
};
