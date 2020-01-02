import React from 'react';

interface Props {
  uic: string;
}

const UIC = ({ uic }: Props) => {
  const br = uic.substr(4, 4);
  const ordnungsnummer = uic.substr(8, 3);

  return (
    <span>
      {br} {ordnungsnummer}
    </span>
  );
};

export default UIC;
