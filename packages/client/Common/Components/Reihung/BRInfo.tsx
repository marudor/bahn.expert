import { stopPropagation } from 'client/Common/stopPropagation';
import type { BRInfo as BRInfoType } from 'types/reihung';
import type { FC } from 'react';

interface Props {
  br: BRInfoType;
  className?: string;
}

export const BRInfo: FC<Props> = ({ br, className }) => {
  let text = br.name;

  if (text === 'IC' && br.country) {
    text = `${text} (${br.country})`;
  }

  if (br.noPdf || !br.identifier)
    return <span className={className}>{text}</span>;

  return (
    <a
      className={className}
      onClick={stopPropagation}
      target="_blank"
      rel="noopener noreferrer"
      href={`/WRSheets/${br.identifier}.pdf`}
    >
      {text}
    </a>
  );
};
