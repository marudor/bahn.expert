import styled from 'styled-components';
import type { SubstituteRef } from 'types/iris';

interface Props {
  substitute: SubstituteRef;
}

const Text = styled.span`
  font-size: 0.7em;
`;
export const Substitute = ({ substitute }: Props) => (
  <>
    <Text>Ersatzzug für</Text>
    <Text>{substitute.train}</Text>
  </>
);
