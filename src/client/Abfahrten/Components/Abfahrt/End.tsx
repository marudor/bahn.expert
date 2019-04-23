import { Abfahrt } from 'types/abfahrten';
import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import Platform from 'Common/Components/Platform';
import React from 'react';
import Times from './Times';

type OwnProps = {
  abfahrt: Abfahrt;
  detail: boolean;
};
type Props = OwnProps & WithStyles<typeof styles>;
const End = ({ abfahrt, detail, classes }: Props) => (
  <div className={classes.main}>
    <Times abfahrt={abfahrt} detail={detail} />
    <Platform
      real={abfahrt.platform}
      scheduled={abfahrt.scheduledPlatform}
      cancelled={abfahrt.isCancelled}
    />
  </div>
);

const styles = createStyles({
  main: {
    fontSize: '2.5em',
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: '1em',
  },
});

export default React.memo(withStyles(styles)(End));
