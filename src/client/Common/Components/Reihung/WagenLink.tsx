import React, { useMemo } from 'react';
import stopPropagation from 'Common/stopPropagation';
import useStyles from './WagenLink.style';

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
const WagenLink = ({ fahrzeugtyp, fahrzeugnummer, type }: Props) => {
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
    return <span className={classes.type}>{fahrzeugtyp}</span>;
  }

  return (
    <a
      onClick={stopPropagation}
      className={classes.type}
      href={`/WRSheets/Wagen/${imageName}.jpg`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {fahrzeugtyp}
    </a>
  );
};

export default WagenLink;
