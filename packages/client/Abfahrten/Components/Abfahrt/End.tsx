import { makeStyles } from '@material-ui/core';
import { Platform } from 'client/Common/Components/Platform';
import { Times } from './Times';
import type { Abfahrt } from 'types/iris';

const useStyles = makeStyles({
  wrap: {
    fontSize: '2.5em',
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: '1em',
  },
});

interface Props {
  abfahrt: Abfahrt;
  detail: boolean;
}
export const End = ({ abfahrt, detail }: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.wrap} data-testid="abfahrtEnd">
      <Times abfahrt={abfahrt} detail={detail} />
      <Platform
        real={abfahrt.platform}
        scheduled={abfahrt.scheduledPlatform}
        cancelled={abfahrt.cancelled}
      />
    </div>
  );
};
