import styled from '@emotion/styled';
import type { FC } from 'react';
import type { SubstituteRef } from '@/types/iris';

const Text = styled.span`
  font-size: 0.7em;
`;
interface Props {
  substitute: SubstituteRef;
}

export const Substitute: FC<Props> = ({ substitute }) => {
  return (
    <>
      <Text>Ersatzzug für</Text>
      <Text>{substitute.train}</Text>
    </>
  );
};
