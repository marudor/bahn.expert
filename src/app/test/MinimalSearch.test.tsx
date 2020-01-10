import { render } from './TestHelper';
import MinimalSearch from '@/MinimalSearch';
import React from 'react';

describe('Simple Proof of Concept Test', () => {
  it('MinimalSearch renders', () => {
    const { baseElement } = render(<MinimalSearch />);

    expect(baseElement).toMatchSnapshot();
  });
});
