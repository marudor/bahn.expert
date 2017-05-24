import axios from 'axios';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import * as Select from 'react-select';
import 'react-select/dist/react-select.css';
import { IStation } from '../Services/AbfahrtenService';
import StationService from '../Services/StationService';
import './Header.less';
import HeaderButtons from './HeaderButtons';

async function stationLoad(input: string) {
  const stations = (await axios.get(`/api/search/${input}`)).data;
  return {
    options: stations,
  };
}

type IProps = RouteComponentProps<{ station: string }>;
interface IState {
  isSearch: boolean;
}

@observer
export default class Header extends React.PureComponent<IProps, IState> {
  public state = {
    isSearch: false,
  };
  public static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  private HomeButton = <Link to="/"><IconButton ><ActionHome color="white" /></IconButton></Link>;
  private submit = (station: IStation) => {
    if (!station) {
      return;
    }
    StationService.setStation(station);
    this.setState({
      isSearch: false,
    });
    this.context.router.history.push(`/${station.title.replace('/', '$SLASH$')}`);
  }
  private onBlur = () => {
    this.setState({
      isSearch: false,
    });
  }
  private filterOption(option: any) {
    return option;
  }
  private SearchBar = (
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
        onChange={this.submit}
      />
    </div>
  );
  public render() {
    const { isSearch } = this.state;
    let title = this.SearchBar;
    if (!isSearch) {
      title = StationService.currentStation ? StationService.currentStation.title : 'Bahnhofs abfahrten';
    }
    return (
      <AppBar
        titleStyle={style.title}
        onTitleTouchTap={this.handleTitleClick}
        iconElementLeft={this.HomeButton}
        iconElementRight={<HeaderButtons handleSearchClick={this.handleTitleClick} />}
        title={title}
        style={style.wrapper}
      />
    );
  }
  public componentDidUpdate() {
    const dom = ReactDOM.findDOMNode(this);
    if (dom) {
      const inputs = dom.querySelectorAll('input');
      if (inputs[0]) {
        inputs[0].focus();
      }
    }
  }
  private handleTitleClick = () => {
    if (this.state.isSearch) {
      return;
    }
    this.setState({
      isSearch: true,
    });
  }
}

const style: any = {
  wrapper: {
    flexShrink: 0,
  },
  title: {
    overflow: 'visible',
  },
};
