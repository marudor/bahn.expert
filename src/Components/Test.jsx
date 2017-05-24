// @flow
import { observer } from 'mobx-react';
import React from 'react';
import TrainRecord from './Wagenreihung/TrainRecord';

const dummy = require('../Services/dummy.json');

@observer
export default class Test extends React.PureComponent {
  render() {
    return <TrainRecord record={dummy.trackRecords[0].trainRecords[0]} />;
  }
}
