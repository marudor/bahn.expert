// @flow
import { observer } from 'mobx-react';
import Abfahrt from './Abfahrt';
import AbfahrtenService from 'Services/AbfahrtenService';
import Loading from './Loading';
import PropTypes from 'prop-types';
import React from 'react';
import type { ContextRouter } from 'react-router';

type Props = ContextRouter;
interface State {
  loading: boolean,
}
@observer
export default class AbfahrtenList extends React.PureComponent {
  props: Props;
  state: State = {
    loading: true,
  };
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  componentWillMount() {
    this.getAbfahrten(this.props);
  }
  componentWillReceiveProps(props: Props) {
    this.getAbfahrten(props);
  }
  async getAbfahrten(props: Props) {
    this.setState({ loading: true });
    await AbfahrtenService.getAbfahrtenByString(props.match.params.station);
    this.setState({ loading: false });
  }
  render() {
    const { loading } = this.state;
    return (
      <Loading isLoading={loading}>
        <div style={style.list}>
          {AbfahrtenService.abfahrten.map(
            a =>
              a &&
              <Abfahrt
                abfahrt={a}
                detail={AbfahrtenService.selectedDetail === a.id}
                key={a.id}/>
          )}
        </div>
      </Loading>
    );
  }
}

const style = {
  list: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  wrapper: {
    flex: 1,
    position: 'relative',
  },
};
