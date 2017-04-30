import { action, observable } from 'mobx';

const DEFAULT_TITLE = 'Bahnhofs Abfahrten';
class TitleService {
  @observable public title: string | React.ReactNode = DEFAULT_TITLE;
  public isSearch: boolean = false;
  private oldTitle: string | React.ReactNode = DEFAULT_TITLE;
  private oldIsSearch: boolean = false;
  @action public changeTitle(title: string | React.ReactNode, isSearch: boolean) {
    this.oldTitle = this.title;
    this.title = title;
    this.oldIsSearch = this.isSearch;
    this.isSearch = isSearch;
  }
  public revertTitle() {
    this.changeTitle(this.oldTitle, this.oldIsSearch);
  }
}

export default new TitleService();
