import { Map } from 'immutable';
import { action, observable } from 'mobx';
import { IStation } from './AbfahrtenService';
import StationService from './StationService';
class FavService {
  @observable public favs: Map<string, IStation>;
  constructor() {
    try {
      const favs: object = JSON.parse(localStorage.getItem('favs') || '{}');
      if (typeof favs === 'object') {
        const keys = Object.keys(favs);
        keys.forEach((k) => {
          if (typeof k !== 'string') {
            throw new Error();
          }
          const val = (favs as any)[k];
          if (typeof val !== 'object' || !('id' in val) || !('title' in val)) {
            throw new Error();
          }
        });
      }
      this.favs = Map<string, IStation>(favs);
    } catch (e) {
      this.favs = Map<string, IStation>({});
    }
  }
  @action public fav(station: IStation) {
    this.favs = this.favs.set(String(station.id), station);
    this.updateStorage();
  }
  @action public unfav(station: IStation) {
    this.favs = this.favs.delete(String(station.id));
    this.updateStorage();
  }

  public isFaved(station: IStation) {
    return this.favs.has(String(station.id));
  }

  private updateStorage() {
    localStorage.setItem('favs', JSON.stringify(this.favs));
  }
}

export default new FavService();
