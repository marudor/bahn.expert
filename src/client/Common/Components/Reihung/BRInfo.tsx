import { BRInfo as BRInfoType } from 'types/reihung';
import stopPropagation from 'Common/stopPropagation';

interface Props {
  br: BRInfoType;
  className?: string;
}

const BRInfo = ({ br, className }: Props) => {
  let text = br.name;

  let bracketText = '';

  if (br.BR) {
    const serieText = br.serie ? ` ${br.serie}. Serie` : '';
    const redesignText = br.redesign ? ' Redesign' : '';
    const countryText = br.country ? ` ${br.country}` : '';

    bracketText = `BR${br.BR}${serieText}${redesignText}${countryText}`;
  } else if (br.country) {
    bracketText = br.country;
  }
  if (bracketText) {
    text += ` (${bracketText})`;
  }

  if (br.noPdf) return <span className={className}>{text}</span>;

  let pdfName = br.pdf || br.BR;

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
