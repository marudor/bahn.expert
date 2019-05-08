import { AbfahrtenState } from 'AppState';
import { connect } from 'react-redux';
import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import { Station } from 'types/station';
import React from 'react';

type StateProps = {
  currentStation?: Station;
};
type Props = StateProps & WithStyles<typeof styles>;

const Footer = ({ currentStation, classes }: Props) => (
  <footer>
    <div className={classes.seo}>
      <a title="Bahnhofstafeln" href="http://bahnhofstafeln.de/">
        Bahnhofstafeln
      </a>
      {currentStation && (
        <>
          <a
            title={`Bahnhofstafeln für ${currentStation.title}`}
            href={`https://iris.noncd.db.de/wbt/js/index.html?typ=ab&bhf=${
              currentStation.id
            }&zeilen=12&via=1&impressum=1&style=ab&lang=de`}
          >
            Bahnhofstafeln für {currentStation.title}
          </a>
        </>
      )}
    </div>
  </footer>
);

const styles = createStyles(theme => ({
  seo: {
    display: 'none',
  }
}));

export default connect<StateProps, void, void, AbfahrtenState>(state => ({
  currentStation: state.abfahrten.currentStation,
}))(withStyles(styles)(Footer));
