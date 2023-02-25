import { Stack } from '@mui/material';
import { useAbfahrt } from '@/client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import styled from '@emotion/styled';
import type { FC } from 'react';

const Extra = styled.span(({ theme }) => ({
  fontSize: '.8em',
  color: theme.palette.text.secondary,
}));

interface Props {}
export const Name: FC<Props> = () => {
  const { lineAndNumber } = useCommonConfig();
  const { abfahrt } = useAbfahrt();
  const longDistance = abfahrt.train.name.endsWith(abfahrt.train.number);

  return (
    <>
      <Stack>
        {abfahrt.previousTrain && <span>{abfahrt.previousTrain.name}</span>}
        <span>{abfahrt.train.name}</span>
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
