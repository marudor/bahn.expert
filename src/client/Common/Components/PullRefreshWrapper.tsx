import PullToRefresh from 'rmc-pull-to-refresh';
import React, { ReactNode, useCallback } from 'react';

interface Props {
  children: ReactNode;
}

const PullRefreshWrapper = ({ children }: Props) => {
  const reload = useCallback(() => window.location.reload(), []);

  return (
    <PullToRefresh direction="down" onRefresh={reload}>
      {children}
    </PullToRefresh>
  );
};

export default PullRefreshWrapper;
