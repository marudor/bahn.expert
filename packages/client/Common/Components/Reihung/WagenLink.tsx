import { makeStyles } from '@material-ui/core';
import { stopPropagation } from 'client/Common/stopPropagation';
import { useMemo } from 'react';
import type { AvailableIdentifier, Fahrzeug } from 'types/reihung';
import type { FC } from 'react';

const useStyles = makeStyles({
  link: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
  },
});

interface Props {
  fahrzeug: Pick<Fahrzeug, 'fahrzeugnummer' | 'fahrzeugtyp' | 'kategorie'>;
  identifier?: AvailableIdentifier;
  type: string;
}

const wagenWithImage = [
  'ARkimbz',
  'ARkimnbz',
  'Apmmz',
  'Avmmz',
  'Avmz',
  'Bimmdzf',
  'Bpmbz',
  'Bpmmbdz',
  'Bpmmbdzf',
  'Bpmmbz',
  'Bpmmdz',
  'Bpmmz',
  'Bvmmsz',
  'Bvmmz',
  'Bvmsz',
  'DApza',
  'DBpza',
  'DBpbzfa',
];

const allowedTypes = ['IC', 'ICE'];

const seriesRegex = /\.S(\d)/;

export const WagenLink: FC<Props> = ({ fahrzeug, identifier, type }) => {
  const classes = useStyles();
  const imageName = useMemo(() => {
    if (
      !allowedTypes.includes(type) ||
      fahrzeug.kategorie === 'TRIEBKOPF' ||
      fahrzeug.kategorie === 'LOK'
    ) {
      return;
    }
    if (
      (!identifier || identifier === 'IC2.TWIN') &&
      wagenWithImage.includes(fahrzeug.fahrzeugtyp)
    ) {
      return fahrzeug.fahrzeugtyp;
    }

    if (identifier && identifier !== 'TGV' && identifier !== 'MET') {
      let relevantUIC = fahrzeug.fahrzeugnummer.substr(4, 5);
      if (identifier.endsWith('R')) {
        relevantUIC += '.r';
      } else if (identifier.includes('.S')) {
        // @ts-expect-error this works
        relevantUIC += `.${seriesRegex.exec(identifier)[1]}`;
      }
      return relevantUIC;
    }
  }, [
    fahrzeug.fahrzeugnummer,
    fahrzeug.fahrzeugtyp,
    fahrzeug.kategorie,
    identifier,
    type,
  ]);

  if (!imageName) {
    return <span className={classes.link}>{fahrzeug.fahrzeugtyp}</span>;
  }

  return (
    <a
      className={classes.link}
      onClick={stopPropagation}
      href={`https://lib.finalrewind.org/dbdb/db_wagen/${imageName}.png`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {fahrzeug.fahrzeugtyp}
    </a>
  );
};
