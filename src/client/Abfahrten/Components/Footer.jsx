// @flow
import { connect } from 'react-redux';
import React from 'react';
import withStyles, { type StyledProps } from 'react-jss';
import type { AbfahrtenState } from 'AppState';
import type { Station } from 'types/station';

type StateProps = {|
  +currentStation: ?Station,
|};
type OwnProps = {||};
type DispatchProps = {|
  dispatch: Dispatch<*>,
|};
type ReduxProps = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
|};
type Props = StyledProps<ReduxProps, typeof styles>;

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

const styles = {
  seo: {
    display: 'none',
  },
};

export default connect<
  ReduxProps,
  OwnProps,
  StateProps,
  DispatchProps,
  AbfahrtenState,
  _
>(state => ({
  currentStation: state.abfahrten.currentStation,
}))(withStyles<Props>(styles)(Footer));
