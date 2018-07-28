// @flow
import './Header.scss';
import { connect } from 'react-redux';
import { getStationsFromAPI, setCurrentStation } from 'actions/abfahrten';
import ActionHome from '@material-ui/icons/Home';
import AppBar from '@material-ui/core/AppBar';
import HeaderButtons from './HeaderButtons';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select/lib/Async';
import Toolbar from '@material-ui/core/Toolbar';
import type { AppState } from 'AppState';
import type { ContextRouter } from 'react-router';
import type { Station } from 'types/abfahrten';

type ReduxProps = {
  currentStation: ?$PropertyType<$PropertyType<AppState, 'abfahrten'>, 'currentStation'>,
};

type Props = ReduxProps &
  ContextRouter & {
    setCurrentStation: typeof setCurrentStation,
  };

const selectStyles = {
  option: (base, state) => ({
    ...base,
    background: state.isFocused ? 'lightgrey' : 'white',
    color: 'black',
  }),
};

class Header extends React.Component<Props> {
  submit = (station: Station) => {
    if (!station) {
      return;
    }
    const { setCurrentStation } = this.props;

    setCurrentStation(station);
    this.props.history.push(`/${station.title.replace('/', '%2F')}`);
  };
  toRoot = () => this.props.history.push('/');
  filterOption(option: any) {
    return option;
  }
  getOptionLabel = (station: Station) => station.title;
  getOptionValue = (station: Station) => station.id;
  render() {
    const { currentStation } = this.props;

    return (
      <AppBar position="fixed">
        <Toolbar className="Header">
          <IconButton onClick={this.toRoot} color="inherit">
            <ActionHome color="inherit" />
          </IconButton>
          <div className="Header__select">
            <Select
              styles={selectStyles}
              loadOptions={getStationsFromAPI}
              getOptionLabel={this.getOptionLabel}
              getOptionValue={this.getOptionValue}
              placeholder="Bahnhof (z.B. Hamburg Hbf)"
              value={currentStation}
              onChange={this.submit}
            />
          </div>
          <HeaderButtons />
        </Toolbar>
      </AppBar>
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
}

export default connect(
  (state: AppState): ReduxProps => ({
    currentStation: state.abfahrten.currentStation,
  }),
  {
    setCurrentStation,
  }
)(Header);
