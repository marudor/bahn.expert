import { cancelledCss, changedCss } from 'client/util/cssUtils';
import styled from 'styled-components';

interface Props {
  className?: string;
  cancelled?: boolean;
  scheduled?: string;
  real?: string;
}

const Wrap = styled.div<{ cancelled?: boolean; changed?: boolean }>`
  ${({ cancelled, changed }) => [
    cancelled && cancelledCss,
    changed && changedCss,
  ]}
`;

const ChangedWrapper = styled.span`
  padding-left: 0.3em;
  ${cancelledCss}
`;

export const Platform = ({ className, cancelled, scheduled, real }: Props) => {
  const changed = Boolean(scheduled && scheduled !== real);

  return (
    <Wrap changed={changed} cancelled={cancelled} className={className}>
      <span data-testid="real">{real}</span>
      {changed && (
        <ChangedWrapper data-testid="scheduled">({scheduled})</ChangedWrapper>
      )}
    </Wrap>
  );
};
