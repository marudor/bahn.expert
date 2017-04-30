import { observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import AbfahrtenService from 'Services/AbfahrtenService';
import Abfahrt from './Abfahrt';
import Loading from './Loading';

type IProps = RouteComponentProps<{ station: string }>;
interface IState {
  loading: boolean;
}
@observer
export default class AbfahrtenList extends React.PureComponent<IProps, IState> {
  public state = {
    loading: true,
  };
  public static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  public componentWillMount() {
    this.getAbfahrten(this.props);
  }
  public componentWillReceiveProps(props: IProps) {
    this.getAbfahrten(props);
  }
  private async getAbfahrten(props: IProps) {
    this.setState({ loading: true });
    await AbfahrtenService.getAbfahrtenByString(props.match.params.station);
    this.setState({ loading: false });
  }
  public render() {
    const { loading } = this.state;
    return (
      <Loading isLoading={loading}>
        <div style={style.list}>
          {AbfahrtenService.abfahrten.map((a) => a && (
            <Abfahrt
              abfahrt={a}
              detail={AbfahrtenService.selectedDetail === a.id}
              key={a.id}
            />
          ))}
        </div>
      </Loading>
    );
  }
}

const style: any = {
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
