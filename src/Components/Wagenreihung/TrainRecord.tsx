import * as React from 'react';

interface IProps {
  record: Reihung.TrainRecord;
}

export default class TrainRecord extends React.PureComponent<IProps, {}> {
  public render() {
    const { record } = this.props;
    return (
      <div>
        <div>
          <span>A</span>
          <span>B</span>
          <span>C</span>
          <span>D</span>
          <span>E</span>
          <span>F</span>
        </div>

      </div>
    );
  }
}
