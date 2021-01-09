import { makeStyles } from '@material-ui/core';
import { stopPropagation } from 'client/Common/stopPropagation';
import { useMemo } from 'react';
import type { AvailableIdentifier } from 'types/reihung';
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
  fahrzeugtyp: string;
  fahrzeugnummer: string;
  identifier?: AvailableIdentifier;
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

// const uicWithImage = [
//   // IC2.KISS
//   '1101',
//   '1104',
//   '1105',
//   '1106',
//   '4038.2',
//   '4038.1',
// ];

const seriesRegex = /\.S(\d)/;

export const WagenLink: FC<Props> = ({
  fahrzeugtyp,
  fahrzeugnummer,
  identifier,
}) => {
  const classes = useStyles();
  const imageName = useMemo(() => {
    if (
      !identifier ||
      (identifier === 'IC2.TWIN' && wagenWithImage.includes(fahrzeugtyp))
    ) {
      return fahrzeugtyp;
    }

    if (identifier !== 'TGV' && identifier !== 'MET') {
      let relevantUIC = fahrzeugnummer.substr(4, 5);
      if (identifier.endsWith('R')) {
        relevantUIC += '.r';
      } else if (identifier.includes('.S')) {
        // @ts-expect-error this works
        relevantUIC += `.${seriesRegex.exec(identifier)[1]}`;
      }
      return relevantUIC;
    }
  }, [fahrzeugnummer, fahrzeugtyp, identifier]);

  if (!imageName) {
    return <span className={classes.link}>{fahrzeugtyp}</span>;
  }

  return (
    <a
      className={classes.link}
      onClick={stopPropagation}
      href={`https://lib.finalrewind.org/dbdb/db_wagen/${imageName}.png`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {fahrzeugtyp}
    </a>
  );
};
