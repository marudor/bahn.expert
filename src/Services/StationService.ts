import { action, observable } from 'mobx';
import { IStation } from './AbfahrtenService';

class StationServivce {
  @observable public currentStation?: IStation;
  @action public setStation(station?: IStation) {
    this.currentStation = station;
  }
}

(global as any).StationService = new StationServivce();
export default (global as any).StationService;
