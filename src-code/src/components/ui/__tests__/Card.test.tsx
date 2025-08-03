import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card, CardHeader, CardBody, CardFooter } from '../Card';

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with default props', () => {
      render(<Card data-testid="card">Card content</Card>);
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('card');
    });

    it('renders with different variants', () => {
      const { rerender } = render(<Card variant="flat" data-testid="card">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('card-flat');

      rerender(<Card variant="outline" data-testid="card">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('card-outline');
    });

    it('renders as interactive', () => {
      render(<Card interactive data-testid="card">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('card-interactive');
    });

    it('renders loading state', () => {
      render(<Card loading data-testid="card">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('card-loading');
    });

    it('forwards className correctly', () => {
      render(<Card className="custom-class" data-testid="card">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('custom-class');
    });
  });

  describe('CardHeader', () => {
    it('renders header content', () => {
      render(<CardHeader>Header Content</CardHeader>);
      const header = screen.getByText('Header Content');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('card-header');
    });

    it('forwards additional props', () => {
      render(<CardHeader data-testid="header">Header</CardHeader>);
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });
  });

  describe('CardBody', () => {
    it('renders body content', () => {
      render(<CardBody>Body Content</CardBody>);
      const body = screen.getByText('Body Content');
      expect(body).toBeInTheDocument();
      expect(body).toHaveClass('card-body');
    });

    it('forwards additional props', () => {
      render(<CardBody data-testid="body">Body</CardBody>);
      expect(screen.getByTestId('body')).toBeInTheDocument();
    });
  });

  describe('CardFooter', () => {
    it('renders footer content', () => {
      render(<CardFooter>Footer Content</CardFooter>);
      const footer = screen.getByText('Footer Content');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('card-footer');
    });

    it('forwards additional props', () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>);
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  describe('Complete Card Structure', () => {
    it('renders full card with all sections', () => {
      render(
        <Card data-testid="full-card">
          <CardHeader>Test Header</CardHeader>
          <CardBody>Test Body</CardBody>
          <CardFooter>Test Footer</CardFooter>
        </Card>
      );

      expect(screen.getByTestId('full-card')).toBeInTheDocument();
      expect(screen.getByText('Test Header')).toBeInTheDocument();
      expect(screen.getByText('Test Body')).toBeInTheDocument();
      expect(screen.getByText('Test Footer')).toBeInTheDocument();
    });
  });
});