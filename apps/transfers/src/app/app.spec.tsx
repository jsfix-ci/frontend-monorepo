import { render } from '@testing-library/react';

import App from './app';

describe('App', () => {
  it('should render a title', () => {
    const { getByText } = render(<App />);

    expect(getByText(/Transfers/gi)).toBeTruthy();
  });
});
