// @flow
import { action, observable } from 'mobx';
import { type IStation } from './AbfahrtenService';

class StationServivce {
  @observable currentStation: ?IStation;
  @action
  setStation(station?: IStation) {
    this.currentStation = station;
  }
}

global.StationService = new StationServivce();
export default global.StationService;
