import { AbfahrtenState } from 'AppState';
import { connect } from 'react-redux';
import { Station } from 'types/station';
import React from 'react';
import useStyles from './Footer.style';

type StateProps = {
  currentStation?: Station;
};
type Props = StateProps;

const Footer = ({ currentStation }: Props) => {
  const classes = useStyles();

  return (
    <footer>
      <div className={classes.seo}>
        <a title="Bahnhofstafeln" href="http://bahnhofstafeln.de/">
          Bahnhofstafeln
        </a>
        {currentStation && (
          <>
            <a
              title={`Bahnhofstafeln für ${currentStation.title}`}
              href={`https://iris.noncd.db.de/wbt/js/index.html?typ=ab&bhf=${currentStation.id}&zeilen=12&via=1&impressum=1&style=ab&lang=de`}
            >
              Bahnhofstafeln für {currentStation.title}
            </a>
          </>
        )}
      </div>
    </footer>
  );
};

export default connect<StateProps, void, void, AbfahrtenState>(state => ({
  currentStation: state.abfahrten.currentStation,
}))(Footer);
