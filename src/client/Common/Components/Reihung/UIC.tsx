import type { FC } from 'react';

interface Props {
  uic?: string;
}

export const UIC: FC<Props> = ({ uic }) => {
  if (!uic) return null;
  const br = uic.slice(4, 8);
  const ordnungsnummer = uic.slice(8, 11);

  return (
    <span data-testid="uic">
      {br} {ordnungsnummer}
    </span>
  );
};
