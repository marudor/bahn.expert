import { setupTs } from 'awesome-typescript-loader/dist/instance';
import { CancelTokenSource } from 'axios';
import axios from 'axios';
import { action, observable } from 'mobx';

const numberRegex = /(\d+)/;
class ReihungService {
  @observable public reihung?: Reihung.SpecificWagenreihung;
  private cancelToken?: CancelTokenSource;
  constructor(station: number, trainText: string) {
    const filtered = trainText.match(numberRegex);
    if (filtered) {
      this.getReihung(station, Number.parseInt(filtered[0], 10));
    }
  }
  @action public async getReihung(station: number, train: number) {
    this.cancelToken = axios.CancelToken.source();
    const rawReihung = (await axios.get(`/api/wagen/${station}/${train}`, {
      cancelToken: this.cancelToken.token,
    })).data[0];
    if (rawReihung) {
      this.reihung = rawReihung.stations[0];
    }
  }
  public dispose() {
    if (this.cancelToken) {
      this.cancelToken.cancel();
    }
  }
}

export default ReihungService;
