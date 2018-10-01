// @flow
import * as React from 'react';
import * as Sentry from '@sentry/browser';

type Props = {
  children: React.Node,
};
type State = {
  error: ?any,
};

const dsn = process.env.SENTRY_DSN;
// eslint-disable-next-line import/no-mutable-exports
let SentryBoundry;

if (dsn) {
  Sentry.init({ dsn });
  SentryBoundry = class SentryBoundry extends React.PureComponent<Props, State> {
    state = {
      error: null,
    };
    componentDidCatch(error: any, errorInfo: any) {
      this.setState({ error });
      Sentry.configureScope(scope => {
        Object.keys(errorInfo).forEach(key => {
          scope.setExtra(key, errorInfo[key]);
        });
      });
      Sentry.captureException(error);
    }
    render() {
      if (this.state.error) {
        // render fallback UI
        return <a onClick={() => Sentry.showReportDialog()}>Report feedback</a>;
      }

      // when there's not an error, render children untouched
      return this.props.children;
    }
  };
} else {
  SentryBoundry = ({ children }: Props) => children;
}
export default SentryBoundry;
