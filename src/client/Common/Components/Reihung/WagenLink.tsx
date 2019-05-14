import React, { useMemo } from 'react';
import stopPropagation from 'Common/stopPropagation';
import useStyles from './WagenLink.style';

interface Props {
  fahrzeugtyp: string;
  fahrzeugnummer: string;
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
const WagenLink = ({ fahrzeugtyp, fahrzeugnummer }: Props) => {
  const classes = useStyles();
  const imageName = useMemo(() => {
    const uicType = Number.parseInt(fahrzeugnummer.substr(8, 3), 10);
    let image = fahrzeugtyp;

    if (uicType >= 500 && uicType <= 506) {
      image += '118';
    }

    return image;
  }, [fahrzeugnummer, fahrzeugtyp]);

  if (!wagenWithImage.includes(fahrzeugtyp)) {
    return <span className={classes.type}>{fahrzeugtyp}</span>;
  }

  return (
    <a
      onClick={stopPropagation}
      href={`/WRSheets/wagen/${imageName}.jpg`}
      target="_blank"
      rel="noreferrer noopener"
      className={classes.type}
    >
      {fahrzeugtyp}
    </a>
  );
};

export default WagenLink;
