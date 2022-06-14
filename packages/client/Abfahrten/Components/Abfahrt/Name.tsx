import { useAbfahrt } from 'client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { useAbfahrtenConfig } from 'client/Abfahrten/provider/AbfahrtenConfigProvider';
import styled from '@emotion/styled';
import type { FC } from 'react';

const Extra = styled.span(({ theme }) => ({
  fontSize: '.8em',
  color: theme.palette.text.secondary,
}));

interface Props {}
export const Name: FC<Props> = () => {
  const { lineAndNumber } = useAbfahrtenConfig();
  const { abfahrt } = useAbfahrt();

  return (
    <>
      <span>{abfahrt.train.name}</span>
      {lineAndNumber && abfahrt.train.line && (
        <Extra>
          {abfahrt.train.longDistance
            ? `Linie ${abfahrt.train.line}`
            : abfahrt.train.number !== '0' &&
              `${abfahrt.train.type} ${abfahrt.train.number}`}
        </Extra>
      )}
    </>
  );
};
