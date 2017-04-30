import { Map } from 'immutable';
import { action, observable } from 'mobx';
import { IStation } from './AbfahrtenService';
import StationService from './StationService';
class FavService {
  @observable public favs: Map<string, IStation>;
  constructor() {
    const favs: IStation[] = JSON.parse(localStorage.getItem('favs') || '{}');
    this.favs = Map<string, IStation>(favs);
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
