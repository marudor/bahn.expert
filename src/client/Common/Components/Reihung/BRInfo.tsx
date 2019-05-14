import { BRInfo as BRInfoType } from 'types/reihung';
import React from 'react';
import stopPropagation from 'Common/stopPropagation';

type Props = {
  br: BRInfoType;
  className?: string;
};

const BRInfo = ({ br, className }: Props) => {
  let text = br.name;

  if (br.BR) {
    const serieText = br.serie ? ` ${br.serie}. Serie` : '';
    const redesignText = br.redesign ? ' Redesign' : '';

    text += ` (BR${br.BR}${serieText}${redesignText})`;
  }

  if (br.noPdf) return <span className={className}>{text}</span>;

  let pdfName = br.BR;

  if (br.redesign) {
    pdfName += 'R';
  } else if (br.serie) {
    pdfName += `.${br.serie}`;
  }

  return (
    <a
      className={className}
      onClick={stopPropagation}
      target="_blank"
      rel="noopener noreferrer"
      href={`/WRSheets/${pdfName}.pdf`}
    >
      {text}
    </a>
  );
};

export default BRInfo;
