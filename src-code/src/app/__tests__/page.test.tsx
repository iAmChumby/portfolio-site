import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../page';

// Mock the site config to match actual implementation
jest.mock('@/data/site-config.json', () => ({
  site: {
    author: {
      name: 'Luke Edwards',
    },
  },
}));

describe('Home Page', () => {
  it('renders the hero section with correct structure', () => {
    render(<Home />);
    
    // Check for the main hero content
    expect(screen.getByText(/Hi, I'm/)).toBeInTheDocument();
    expect(screen.getByText('Luke Edwards')).toBeInTheDocument();
    expect(screen.getByText('Full Stack Developer & UI/UX Designer')).toBeInTheDocument();
  });

  it('renders the hero description', () => {
    render(<Home />);
    
    expect(screen.getByText(/I create beautiful, functional, and user-centered digital experiences/)).toBeInTheDocument();
    expect(screen.getByText(/Passionate about clean code, innovative design, and solving complex problems/)).toBeInTheDocument();
  });

  it('renders the main action buttons', () => {
    render(<Home />);
    
    expect(screen.getByText('View My Work')).toBeInTheDocument();
    expect(screen.getByText('Get In Touch')).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    render(<Home />);
    
    // Check for main element
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('min-h-screen');
  });

  it('renders with proper heading hierarchy', () => {
    render(<Home />);
    
    // Check for h1 and h2 elements
    const h1 = screen.getByRole('heading', { level: 1 });
    const h2 = screen.getByRole('heading', { level: 2 });
    
    expect(h1).toBeInTheDocument();
    expect(h2).toBeInTheDocument();
    expect(h2).toHaveTextContent('Full Stack Developer & UI/UX Designer');
  });
});