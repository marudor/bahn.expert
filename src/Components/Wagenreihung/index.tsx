import { observer } from 'mobx-react';
import * as React from 'react';
import { IAbfahrt, IStation } from '../../Services/AbfahrtenService';
import ReihungService from '../../Services/ReihungService';
import StationService from '../../Services/StationService';
import Loading from '../Loading';
import TrainRecord from './TrainRecord';

interface IProps {
  abfahrt: IAbfahrt;
}

@observer
export default class Wagenreihung extends React.PureComponent<IProps, {}> {
  private reihungService: ReihungService;
  public componentWillMount() {
    const { abfahrt } = this.props;
    const currentStation: IStation = StationService.currentStation;
    if (!currentStation) {
      return;
    }
    this.reihungService = new ReihungService(currentStation.id, abfahrt.train);
  }
  public componentWillUnmount() {
    this.reihungService.dispose();
  }
  public render() {
    const reihung = this.reihungService.reihung;
    let record;
    try {
      record = reihung && reihung.trackRecords[0].trainRecords[0];
    } catch (e) {
      return null;
    }
    return (
      <Loading flat={true} isLoading={!Boolean(reihung)}>
        <div>
          {record && (<TrainRecord record={record} />)}
        </div>
      </Loading>
    );

  }
}
