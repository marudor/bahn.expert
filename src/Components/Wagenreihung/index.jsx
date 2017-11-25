// @flow
import { observer } from 'mobx-react';
import Loading from '../Loading';
import React from 'react';
import ReihungService from '../../Services/ReihungService';
import StationService from '../../Services/StationService';
import TrainRecord from './TrainRecord';
import type { IAbfahrt, IStation } from '../../Services/AbfahrtenService';

type Props = {
  abfahrt: IAbfahrt,
};

@observer
export default class Wagenreihung extends React.PureComponent<Props> {
  props: Props;
  reihungService: ReihungService;
  componentWillMount() {
    const { abfahrt } = this.props;
    const currentStation: ?IStation = StationService.currentStation;

    if (!currentStation) {
      return;
    }
    this.reihungService = new ReihungService(currentStation.id, abfahrt.train);
  }
  componentWillUnmount() {
    this.reihungService.dispose();
  }
  render() {
    const reihung = this.reihungService.reihung;
    let record;

    try {
      record = reihung && reihung.trackRecords[0].trainRecords[0];
    } catch (e) {
      return null;
    }

    return (
      <Loading flat isLoading={!reihung}>
        <div>{record && <TrainRecord record={record} />}</div>
      </Loading>
    );
  }
}
