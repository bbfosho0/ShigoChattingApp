import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the ShigoChat splash screen', () => {
  render(<App />);
  expect(screen.getByText('A quieter place to connect.')).toBeInTheDocument();
});
