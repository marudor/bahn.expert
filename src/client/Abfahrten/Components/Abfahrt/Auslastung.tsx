import { Abfahrt } from 'types/abfahrten';
import { getAuslastung } from 'Abfahrten/actions/auslastung';
import { useAbfahrtenSelector } from 'useSelector';
import { useDispatch } from 'react-redux';
import AuslastungsDisplay from 'Common/Components/AuslastungsDisplay';
import Loading from 'Common/Components/Loading';
import React, { useEffect } from 'react';

interface Props {
  abfahrt: Abfahrt;
}

const Auslastung = ({ abfahrt }: Props) => {
  const auslastung = useAbfahrtenSelector(
    state =>
      state.auslastung.auslastung[
        `${abfahrt.currentStation.id}/${abfahrt.destination}/${abfahrt.train.number}`
      ]
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!auslastung && abfahrt.departure) {
      dispatch(
        getAuslastung(
          abfahrt.train.number,
          abfahrt.currentStation.id,
          abfahrt.destination,
          abfahrt.departure.scheduledTime
        )
      );
    }
  }, [abfahrt, auslastung, dispatch]);

  if (auslastung === null) {
    return null;
  }

  if (auslastung === undefined) {
    return <Loading type={1} />;
  }

  return <AuslastungsDisplay auslastung={auslastung} />;
};

export default Auslastung;
