interface Props {
  uic: string;
}

export const UIC = ({ uic }: Props) => {
  const br = uic.substr(4, 4);
  const ordnungsnummer = uic.substr(8, 3);

  return (
    <span>
      {br} {ordnungsnummer}
    </span>
  );
};
