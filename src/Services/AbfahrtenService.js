// @flow
import { action, observable } from 'mobx';
import { List } from 'immutable';
import axios from 'axios';
import StationService from './StationService';
import uuid from 'uuid';

export interface IStation {
  id: number,
  title: string,
}
export interface IMessage {
  text: string,
  timestamp: string,
}

export interface ITrain {
  isAdditional?: 0 | 1,
  isCancelled?: 0 | 1,
  name: string,
}

export interface IMessages {
  qos: IMessage[],
  delay: IMessage[],
}
export interface IAbfahrt {
  id: string,
  delayArrival: number,
  delayDeparture: number,
  destination: string,
  isCancelled: 0 | 1,
  messages: IMessages,
  platform: string,
  route: ITrain[],
  scheduledArrival: string,
  scheduledDeparture: string,
  scheduledPlatform: string,
  train: string,
  via: string[],
}

class AbfahrtenService {
  @observable abfahrten: List<IAbfahrt> = List([]);
  @observable selectedDetail: ?string;
  async getStation(stationString: string): Promise<IStation> {
    const possibleStations = (await axios.get(`/api/search/${stationString}`)).data;
    if (possibleStations.length) {
      return possibleStations[0];
    }
    return { title: '', id: 0 };
  }
  @action
  async getAbfahrtenByStation(station: IStation) {
    StationService.setStation(station);
    const abfahrten: {
      error?: any,
      departures: IAbfahrt[],
    } = (await axios.get(`/api/abfahrten/${station.id}`)).data;
    if (abfahrten.error) {
      throw new Error(abfahrten.error);
    }
    abfahrten.departures.forEach(a => (a.id = uuid.v4()));
    this.abfahrten = List(abfahrten.departures);
  }
  async getAbfahrtenByString(stationString: string) {
    this.abfahrten = List([]);
    const station = await this.getStation(stationString);

    if (station.id !== 0) {
      await this.getAbfahrtenByStation(station);
    }
  }
  normalizeName(name: string) {
    let normalizedName = name.replace(/([^ ])\(/, '$1 (');
    normalizedName = name.replace(/\)(.)/, ') $1');
    normalizedName = name.replace(/Frankfurt \(M\)/, 'Frankfurt (Main)');
    return normalizedName;
  }
  @action
  setDetail(abfahrt: IAbfahrt) {
    if (this.selectedDetail === abfahrt.id) {
      this.selectedDetail = undefined;
    } else {
      this.selectedDetail = abfahrt.id;
    }
  }
}

export default new AbfahrtenService();
