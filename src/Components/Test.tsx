import * as React from 'react';
import TrainRecord from './Wagenreihung/TrainRecord';

const dummy = require('../Services/dummy.json');

export default class Test extends React.PureComponent<any, any> {
  public render() {
    return (
      <TrainRecord record={dummy.trackRecords[0].trainRecords[0]} />
    );
  }
}
