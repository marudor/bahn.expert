import { DetailsLink } from '@/client/Common/Components/Details/DetailsLink';
import { useAbfahrt } from '@/client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { useAbfahrtenUrlPrefix } from '@/client/Abfahrten/provider/AbfahrtenConfigProvider';
import styled from '@emotion/styled';
import type { SubstituteRef } from '@/types/iris';

const Text = styled.span`
  font-size: 0.7em;
`;
interface Props {
  reference: SubstituteRef;
  className?: string;
}

export const Ref: FCC<Props> = ({ reference, children, className }) => {
  const urlPrefix = useAbfahrtenUrlPrefix();
  const { abfahrt, detail } = useAbfahrt();
  let refTrain = <Text className={className}>{reference.name}</Text>;
  if (detail) {
    const C = Text.withComponent(DetailsLink);
    refTrain = (
      <C
        className={className}
        urlPrefix={urlPrefix}
        train={reference}
        evaNumberAlongRoute={abfahrt.currentStopPlace.evaNumber}
        initialDeparture={abfahrt.initialDeparture}
      >
        {reference.name}
      </C>
    );
  }
  return (
    <>
      <Text className={className}>{children}</Text>
      {refTrain}
    </>
  );
};
