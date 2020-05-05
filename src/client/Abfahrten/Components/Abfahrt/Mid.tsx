import cc from 'clsx';
import Info from './Info';
import useStyles from './Mid.style';
import type { Abfahrt } from 'types/iris';

interface Props {
  abfahrt: Abfahrt;
  detail: boolean;
}

const Mid = ({ abfahrt, detail }: Props) => {
  const classes = useStyles();

  return (
    <div
      data-testid="abfahrtMid"
      className={cc(
        {
          [classes.detail]: detail,
        },
        classes.main
      )}
    >
      <Info abfahrt={abfahrt} detail={detail} />
      <div
        className={cc(classes.destination, {
          [classes.cancelled]: abfahrt.cancelled,
          [classes.different]:
            !abfahrt.cancelled &&
            abfahrt.destination !== abfahrt.scheduledDestination,
        })}
      >
        {abfahrt.cancelled ? abfahrt.scheduledDestination : abfahrt.destination}
      </div>
    </div>
  );
};

export default Mid;
