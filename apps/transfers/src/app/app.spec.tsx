import { render } from '@testing-library/react';

import App from './app';

describe('App', () => {
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should render successfully', () => {
    const { baseElement } = render(<App />);

    expect(baseElement).toBeTruthy();
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should have a greeting as the title', () => {
    const { getByText } = render(<App />);

    expect(getByText(/Welcome transfers/gi)).toBeTruthy();
  });
});
