// @flow
import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import ReactDOM from 'react-dom';
import './cxsRender';
import './index.less';

import BahnhofsAbfahrten from 'Components/BahnhofsAbfahrten';

injectTapEventPlugin();

const container = document.getElementById('abfahrten');

if (container) {
  ReactDOM.render(<BahnhofsAbfahrten />, container);
} else {
  // eslint-disable-next-line
  alert('trollololo');
}
