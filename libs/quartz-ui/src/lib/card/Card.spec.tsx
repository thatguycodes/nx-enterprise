import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders title', () => {
    render(<Card title="Hello">Content</Card>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});

