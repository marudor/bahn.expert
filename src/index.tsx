import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import './cxsRender';
import './index.less';

import BahnhofsAbfahrten from 'Components/BahnhofsAbfahrten';

injectTapEventPlugin();

setTimeout(() => {
  ReactDOM.render(
    <BahnhofsAbfahrten />,
    document.getElementById('example'),
  );
}, 500);
