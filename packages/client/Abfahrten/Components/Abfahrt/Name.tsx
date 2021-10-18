import { makeStyles } from '@material-ui/core';
import { useAbfahrt } from 'client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { useAbfahrtenConfig } from 'client/Abfahrten/provider/AbfahrtenConfigProvider';
import type { FC } from 'react';

const useStyles = makeStyles((theme) => ({
  extra: {
    fontSize: '.8em',
    color: theme.palette.text.secondary,
  },
}));

interface Props {}
export const Name: FC<Props> = () => {
  const classes = useStyles();
  const { lineAndNumber } = useAbfahrtenConfig();
  const { abfahrt } = useAbfahrt();

  return (
    <>
      <span>{abfahrt.train.name}</span>
      {lineAndNumber && abfahrt.train.line && (
        <span className={classes.extra}>
          {abfahrt.train.longDistance
            ? `Linie ${abfahrt.train.line}`
            : `${abfahrt.train.type} ${abfahrt.train.number}`}
        </span>
      )}
    </>
  );
};
