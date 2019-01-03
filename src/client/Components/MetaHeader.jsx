// @flow
import { connect } from 'react-redux';
import Helmet from 'react-helmet-async';
import React from 'react';
import type { AppState } from 'AppState';

function getMetaDescription(currentStation) {
  let content = 'Bahnhofs Abfahrten';

  if (currentStation) {
    content += ` ${currentStation.title}`;
  }

  return <meta name="Description" content={content} />;
}

function getTitle(currentStation) {
  let title = 'Bahnhofs Abfahrten';

  if (currentStation) {
    title = `${currentStation.title} - ${title}`;
  }

  return <title>{title}</title>;
}

function getMetaKeywords(currentStation) {
  let keywords = 'Bahnhofs Abfahrten, Bahn, Abfahrten, Bahnhof, Verspätung, Pünktlich';

  if (currentStation) {
    keywords = `${currentStation.title}, ${keywords}`;
  }

  return <meta name="keywords" content={keywords} />;
}

type StateProps = {|
  currentStation: ?$PropertyType<$PropertyType<AppState, 'abfahrten'>, 'currentStation'>,
|};
type Props = {|
  ...StateProps,
|};

const MetaHeader = ({ currentStation }: Props) => (
  <Helmet>
    {getTitle(currentStation)}
    {getMetaDescription(currentStation)}
    {getMetaKeywords(currentStation)}
  </Helmet>
);

export default connect<AppState, Function, {||}, StateProps>(state => ({
  currentStation: state.abfahrten.currentStation,
}))(MetaHeader);
