import { css, Stack, styled } from '@mui/material';
import { DetailsLink } from '@/client/Common/Components/Details/DetailsLink';
import { useAbfahrt } from '@/client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { useAbfahrtenUrlPrefix } from '@/client/Abfahrten/provider/AbfahrtenConfigProvider';
import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import type { FC } from 'react';

const Extra = styled('span')(({ theme }) => ({
  fontSize: '.8em',
  color: theme.palette.text.secondary,
}));

const widthCss = css`
  width: fit-content;
`;

interface Props {
  withLink?: boolean;
}
export const Name: FC<Props> = ({ withLink }) => {
  const urlPrefix = useAbfahrtenUrlPrefix();
  const { lineAndNumber } = useCommonConfig();
  const { abfahrt } = useAbfahrt();
  const longDistance = abfahrt.train.name.endsWith(abfahrt.train.number);

  let trainName = <span>{abfahrt.train.name}</span>;
  if (withLink) {
    trainName = (
      <DetailsLink
        css={widthCss}
        urlPrefix={urlPrefix}
        train={abfahrt.previousTrain || abfahrt.train}
        evaNumberAlongRoute={abfahrt.currentStopPlace.evaNumber}
        initialDeparture={abfahrt.initialDeparture}
        journeyId={abfahrt.journeyId}
      >
        {trainName}
      </DetailsLink>
    );
  }

  return (
    <>
      <Stack>
        {abfahrt.previousTrain && <span>{abfahrt.previousTrain.name}</span>}
        {trainName}
      </Stack>
      {lineAndNumber && abfahrt.train.line && (
        <Extra>
          {longDistance
            ? `Linie ${abfahrt.train.line}`
            : abfahrt.train.number !== '0' &&
              `${abfahrt.train.type} ${abfahrt.train.number}`}
        </Extra>
      )}
    </>
  );
};
