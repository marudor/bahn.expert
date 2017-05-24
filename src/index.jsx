// @flow
import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import ReactDOM from 'react-dom';
import './cxsRender';
import './index.less';

import BahnhofsAbfahrten from 'Components/BahnhofsAbfahrten';

injectTapEventPlugin();

ReactDOM.render(<BahnhofsAbfahrten />, document.getElementById('example'));
