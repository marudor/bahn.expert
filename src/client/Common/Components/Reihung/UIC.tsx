import type { FC } from 'react';

interface Props {
  uic?: string;
}

export const UIC: FC<Props> = ({ uic }) => {
  if (!uic) return null;
  const br = uic.substr(4, 4);
  const ordnungsnummer = uic.substr(8, 3);

  return (
    <span data-testid="uic">
      {br} {ordnungsnummer}
    </span>
  );
};
