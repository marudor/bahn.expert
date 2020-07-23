import { useMemo } from 'react';
import stopPropagation from 'client/Common/stopPropagation';
import styled from 'styled-components/macro';

const A = styled.a`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
`;
const Span = A.withComponent('span');

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
    return <Span>{fahrzeugtyp}</Span>;
  }

  return (
    <A
      onClick={stopPropagation}
      href={`/WRSheets/Wagen/${imageName}.jpg`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {fahrzeugtyp}
    </A>
  );
};

export default WagenLink;
