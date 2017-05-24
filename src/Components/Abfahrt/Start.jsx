// @flow
import React from 'react';

interface Props {
  train: string,
  cancelled: 0 | 1,
}
const Start = ({ train, cancelled }: Props) => (
  <div style={[style.train, cancelled && style.cancelled]}>
    {train}
  </div>
);

export default Start;

const style = {
  cancelled: { textDecoration: 'line-through' },
  train: {
    '@media screen and (max-width: 1200px)': { maxWidth: 75 },
    flex: 1,
    fontSize: '3em',
    lineHeight: 1.2,
    maxWidth: 280,
  },
};
