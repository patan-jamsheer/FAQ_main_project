import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Support Hub navbar brand', () => {
  render(<App />);
  const titleElement = screen.getByText(/SupportHub/i);
  expect(titleElement).toBeInTheDocument();
});
