// @flow
import { action, observable } from 'mobx';
import type React from 'react';

const DEFAULT_TITLE = 'Bahnhofs Abfahrten';

class TitleService {
  @observable title: string | React.Element<any> = DEFAULT_TITLE;
  isSearch: boolean = false;
  oldTitle: string | React.Element<any> = DEFAULT_TITLE;
  oldIsSearch: boolean = false;
  @action
  changeTitle(title: string | React.Element<any>, isSearch: boolean) {
    this.oldTitle = this.title;
    this.title = title;
    this.oldIsSearch = this.isSearch;
    this.isSearch = isSearch;
  }
  revertTitle() {
    this.changeTitle(this.oldTitle, this.oldIsSearch);
  }
}

export default new TitleService();
