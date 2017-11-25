// @flow
import { action, observable } from 'mobx';
import { CancelTokenSource } from 'axios';
import axios from 'axios';

const numberRegex = /(\d+)/;

class ReihungService {
  @observable reihung: ?SpecificWagenreihung;
  cancelToken: ?CancelTokenSource;
  constructor(station: string, trainText: string) {
    const filtered = trainText.match(numberRegex);

    if (filtered) {
      this.getReihung(station, Number.parseInt(filtered[0], 10));
    }
  }
  @action
  async getReihung(station: string, train: number) {
    this.cancelToken = axios.CancelToken.source();
    const rawReihung = (await axios.get(`/api/wagen/${station}/${train}`, {
      cancelToken: this.cancelToken.token,
    })).data[0];

    if (rawReihung) {
      this.reihung = rawReihung.stations[0];
    }
  }
  dispose() {
    if (this.cancelToken) {
      this.cancelToken.cancel();
    }
  }
}

export default ReihungService;
