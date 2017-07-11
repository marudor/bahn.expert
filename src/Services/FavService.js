// @flow
import { action, observable } from 'mobx';
import { IStation } from './AbfahrtenService';
import { Map } from 'immutable';

class FavService {
  @observable favs: Map<string, IStation>;
  constructor() {
    try {
      const favs: Object = JSON.parse(localStorage.getItem('favs') || '{}');
      if (typeof favs === 'object') {
        const keys = Object.keys(favs);
        keys.forEach(k => {
          if (typeof k !== 'string') {
            throw new Error();
          }
          const val = (favs: any)[k];
          if (typeof val !== 'object' || !('id' in val) || !('title' in val)) {
            throw new Error();
          }
        });
      }
      this.favs = Map(favs);
    } catch (e) {
      this.favs = Map({});
    }
  }
  @action
  fav(station: IStation) {
    this.favs = this.favs.set(String(station.id), station);
    this.updateStorage();
  }
  @action
  unfav(station: IStation) {
    this.favs = this.favs.delete(String(station.id));
    this.updateStorage();
  }

  isFaved(station: IStation) {
    return this.favs.has(String(station.id));
  }

  updateStorage() {
    localStorage.setItem('favs', JSON.stringify(this.favs));
  }
}

export default new FavService();
