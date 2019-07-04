import { Abfahrt } from 'types/abfahrten';
import Platform from 'Common/Components/Platform';
import React from 'react';
import Times from './Times';
import useStyles from './End.style';

type OwnProps = {
  abfahrt: Abfahrt;
  detail: boolean;
};
type Props = OwnProps;
const End = ({ abfahrt, detail }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <Times abfahrt={abfahrt} detail={detail} />
      <Platform
        real={abfahrt.platform}
        scheduled={abfahrt.scheduledPlatform}
        cancelled={abfahrt.cancelled}
      />
    </div>
  );
};

export default End;
