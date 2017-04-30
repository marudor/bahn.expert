import * as React from 'react';

interface IProps {
  train: string;
  cancelled: 0 | 1;
}
const Start = ({ train, cancelled }: IProps) => (
  <div style={[style.train, cancelled && style.cancelled]}>
    {train}
  </div>
);

export default Start;

const style: any = {
  cancelled: { textDecoration: 'line-through' },
  train: {
    '@media screen and (max-width: 1200px)': { maxWidth: 75 },
    'flex': 1,
    'fontSize': '3em',
    'lineHeight': 1.2,
    'maxWidth': 280,
  },
};
