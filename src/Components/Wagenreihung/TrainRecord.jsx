// @flow
import { observer } from 'mobx-react';
import React from 'react';

interface Props {
  record: TrainRecord,
}

@observer
export default class TrainRecordComponent extends React.PureComponent {
  props: Props;
  render() {
    // const { record } = this.props;
    return (
      <div>
        <div>
          <span>
            {'A'}
          </span>
          <span>
            {'B'}
          </span>
          <span>
            {'C'}
          </span>
          <span>
            {'D'}
          </span>
          <span>
            {'E'}
          </span>
          <span>
            {'F'}
          </span>
        </div>
      </div>
    );
  }
}
