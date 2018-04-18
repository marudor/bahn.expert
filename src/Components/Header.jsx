// @flow
import './Header.scss';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setCurrentStation } from 'actions/abfahrten';
import ActionHome from 'material-ui/svg-icons/action/home';
import AppBar from 'material-ui/AppBar';
import axios from 'axios';
import HeaderButtons from './HeaderButtons';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import type { AppState } from 'AppState';
import type { ContextRouter } from 'react-router';
import type { Station } from 'types/abfahrten';

async function stationLoad(input: string) {
  const stations = (await axios.get(`/api/search/${input}`)).data;

  return {
    options: stations,
  };
}

type ReduxProps = {
  currentStation: ?$PropertyType<$PropertyType<AppState, 'abfahrten'>, 'currentStation'>,
};

type Props = ReduxProps &
  ContextRouter & {
    setCurrentStation: typeof setCurrentStation,
  };
type State = {
  isSearch: boolean,
};

class Header extends React.Component<Props, State> {
  state: State = {
    isSearch: false,
  };
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  HomeButton = (
    <Link to="/">
      <IconButton>
        <ActionHome color="white" />
      </IconButton>
    </Link>
  );
  submit = (station: Station) => {
    if (!station) {
      return;
    }
    const { setCurrentStation } = this.props;

    setCurrentStation(station);
    this.setState({
      isSearch: false,
    });
    this.context.router.history.push(`/${station.title.replace('/', '%2F')}`);
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
    <div className="Header__select">
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
  render() {
    const { isSearch } = this.state;
    const { currentStation } = this.props;
    let title = this.SearchBar;

    if (!isSearch) {
      title = currentStation ? currentStation.title : 'Bahnhofs abfahrten';
    }

    return (
      <AppBar
        onTitleClick={this.handleTitleClick}
        iconElementLeft={this.HomeButton}
        iconElementRight={<HeaderButtons handleSearchClick={this.handleTitleClick} />}
        title={title}
        className="Header"
      />
    );
  }
  componentDidUpdate() {
    // eslint-disable-next-line
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

export default connect(
  (state: AppState): ReduxProps => ({
    currentStation: state.abfahrten.currentStation,
  }),
  {
    setCurrentStation,
  }
)(Header);
