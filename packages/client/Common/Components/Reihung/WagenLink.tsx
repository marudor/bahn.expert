import { makeStyles } from '@material-ui/core';
import { stopPropagation } from 'client/Common/stopPropagation';
import { useMemo } from 'react';
import type { FC } from 'react';

const useStyles = makeStyles({
  link: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
  },
});

interface Props {
  fahrzeugtyp: string;
  fahrzeugnummer: string;
  type: string;
}

const wagenWithImage = [
  'Apmmz',
  'ARkimbz',
  'ARKimmbz',
  'Avmmz',
  'Avmz',
  'Bimmdzf',
  'Bpmmbdz',
  'Bpmmbdzf',
  'Bpmmbz',
  'Bpmmdz',
  'Bpmmz',
  'Bpmz',
  'Bvmmsz',
  'Bvmmz',
  'Bvmsz',
];
export const WagenLink: FC<Props> = ({ fahrzeugtyp, fahrzeugnummer, type }) => {
  const classes = useStyles();
  const imageName = useMemo(() => {
    let image = fahrzeugtyp;

    if (fahrzeugtyp === 'Apmmz') {
      const uicType = Number.parseInt(fahrzeugnummer.substr(8, 3), 10);

      if (uicType >= 500 && uicType <= 506) {
        image += '118';
      }
    }

    return image;
  }, [fahrzeugnummer, fahrzeugtyp]);

  if (type !== 'IC' || !wagenWithImage.includes(fahrzeugtyp)) {
    return <span className={classes.link}>{fahrzeugtyp}</span>;
  }

  return (
    <a
      className={classes.link}
      onClick={stopPropagation}
      href={`/WRSheets/Wagen/${imageName}.jpg`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {fahrzeugtyp}
    </a>
  );
};
