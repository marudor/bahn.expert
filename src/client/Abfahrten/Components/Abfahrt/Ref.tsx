import { DetailsLink } from '@/client/Common/Components/Details/DetailsLink';
import { useAbfahrt } from '@/client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { useAbfahrtenUrlPrefix } from '@/client/Abfahrten/provider/AbfahrtenConfigProvider';
import styled from '@emotion/styled';
import type { SubstituteRef } from '@/types/iris';

const Text = styled.span`
  font-size: 0.7em;
`;
const StyledDetailsLink = Text.withComponent(DetailsLink);
interface Props {
  reference: SubstituteRef;
  className?: string;
}

export const Ref: FCC<Props> = ({ reference, children, className }) => {
  const urlPrefix = useAbfahrtenUrlPrefix();
  const { abfahrt } = useAbfahrt();
  return (
    <>
      <Text className={className}>{children}</Text>
      <StyledDetailsLink
        className={className}
        urlPrefix={urlPrefix}
        train={reference}
        evaNumberAlongRoute={abfahrt.currentStopPlace.evaNumber}
        initialDeparture={abfahrt.initialDeparture}
      >
        {reference.name}
      </StyledDetailsLink>
    </>
  );
};
