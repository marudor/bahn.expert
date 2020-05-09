import Platform from 'client/Common/Components/Platform';
import Times from './Times';
import useStyles from './End.style';
import type { Abfahrt } from 'types/iris';

interface Props {
  abfahrt: Abfahrt;
  detail: boolean;
}
const End = ({ abfahrt, detail }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.main} data-testid="abfahrtEnd">
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
