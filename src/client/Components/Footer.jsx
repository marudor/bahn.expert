// @flow
import './Footer.scss';
import { connect } from 'react-redux';
import React from 'react';
import type { AppState } from 'AppState';
import type { Station } from 'types/abfahrten';

type StateProps = {|
  currentStation: ?Station,
|};
type Props = {| ...StateProps |};

const Footer = ({ currentStation }: Props) => (
  <footer className="Footer">
    <div className="Footer__seo">
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

export default connect<Props, *, StateProps, _, AppState, _>(state => ({
  currentStation: state.abfahrten.currentStation,
}))(Footer);
