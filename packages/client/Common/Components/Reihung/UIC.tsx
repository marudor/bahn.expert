import type { FC } from 'react';

interface Props {
  uic: string;
}

export const UIC: FC<Props> = ({ uic }) => {
  const br = uic.substr(4, 4);
  const ordnungsnummer = uic.substr(8, 3);

  return (
    <span>
      {br} {ordnungsnummer}
    </span>
  );
};
