import { makeStyles } from '@material-ui/core';
import { Platform } from 'client/Common/Components/Platform';
import { Times } from './Times';
import { useAbfahrt } from 'client/Abfahrten/Components/Abfahrt/BaseAbfahrt';

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

export const End = () => {
  const classes = useStyles();
  const { abfahrt } = useAbfahrt();
  return (
    <div className={classes.wrap} data-testid="abfahrtEnd">
      <Times />
      <Platform
        real={abfahrt.platform}
        scheduled={abfahrt.scheduledPlatform}
        cancelled={abfahrt.cancelled}
      />
    </div>
  );
};
