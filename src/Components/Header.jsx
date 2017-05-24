// @flow
import axios from 'axios';
import './Header.less';
import { IStation } from '../Services/AbfahrtenService';
import { observer } from 'mobx-react';
import ActionHome from 'material-ui/svg-icons/action/home';
import 'react-select/dist/react-select.css';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import HeaderButtons from './HeaderButtons';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import StationService from '../Services/StationService';
import type { ContextRouter } from 'react-router';

async function stationLoad(input: string) {
  const stations = (await axios.get(`/api/search/${input}`)).data;
  return {
    options: stations,
  };
}

type Props = ContextRouter;
interface State {
  isSearch: boolean,
}

@observer
export default class Header extends React.PureComponent {
  props: Props;
  state: State = {
    isSearch: false,
  };
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  HomeButton = (
    <Link to="/"><IconButton><ActionHome color="white" /></IconButton></Link>
  );
  submit = (station: IStation) => {
    if (!station) {
      return;
    }
    StationService.setStation(station);
    this.setState({
      isSearch: false,
    });
    this.context.router.history.push(
      `/${station.title.replace('/', '$SLASH$')}`
    );
  };
  onBlur = () => {
    this.setState({
      isSearch: false,
    });
  };
  filterOption(option: any) {
    return option;
  }
  SearchBar = (
    <div className="selectWrap">
      <Select.Async
        filterOption={this.filterOption}
        autoload={false}
        ignoreAccents={false}
        loadOptions={stationLoad}
        valueKey="id"
        labelKey="title"
        placeholder="Bahnhof..."
        onBlur={this.onBlur}
        onChange={this.submit}/>
    </div>
  );
  render() {
    const { isSearch } = this.state;
    let title = this.SearchBar;
    if (!isSearch) {
      title = StationService.currentStation
        ? StationService.currentStation.title
        : 'Bahnhofs abfahrten';
    }
    return (
      <AppBar
        titleStyle={style.title}
        onTitleTouchTap={this.handleTitleClick}
        iconElementLeft={this.HomeButton}
        iconElementRight={
          <HeaderButtons handleSearchClick={this.handleTitleClick} />
        }
        title={title}
        style={style.wrapper}/>
    );
  }
  componentDidUpdate() {
    const dom = ReactDOM.findDOMNode(this);
    if (dom) {
      // $FlowFixMe
      const inputs = dom.querySelectorAll('input');
      if (inputs[0]) {
        inputs[0].focus();
      }
    }
  }
  handleTitleClick = () => {
    if (this.state.isSearch) {
      return;
    }
    this.setState({
      isSearch: true,
    });
  };
}

const style = {
  wrapper: {
    flexShrink: 0,
  },
  title: {
    overflow: 'visible',
  },
};
