// @flow
import './Loading.scss';
import * as React from 'react';

type Props = {|
  +isLoading?: boolean,
  +className?: string,
  +children?: React.Node,
  +type?: 0 | 1,
|};

function getType(type: 0 | 1) {
  switch (type) {
    default:
    case 0:
      return (
        <div className="sk-cube-grid">
          <div className="sk-cube sk-cube1" />
          <div className="sk-cube sk-cube2" />
          <div className="sk-cube sk-cube3" />
          <div className="sk-cube sk-cube4" />
          <div className="sk-cube sk-cube5" />
          <div className="sk-cube sk-cube6" />
          <div className="sk-cube sk-cube7" />
          <div className="sk-cube sk-cube8" />
          <div className="sk-cube sk-cube9" />
        </div>
      );
    case 1:
      return (
        <div className="lds-facebook">
          <div />
          <div />
          <div />
        </div>
      );
  }
}

const Loading = ({ isLoading, className, children, type = 0 }: Props) => {
  if (isLoading || !children) {
    return <div className={className}>{getType(type)}</div>;
  }

  return children;
};

export default React.memo<Props>(Loading);
