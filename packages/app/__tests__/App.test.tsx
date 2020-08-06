import 'react-native';
import App from 'app/App';
import React from 'react';

import { render } from '@testing-library/react-native';

it('renders correctly', () => {
  const { queryByTestId } = render(<App />);
  expect(queryByTestId('App')).toBeTruthy();
});
