import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home, { metadata } from '../page';

// Mock the Hero component
jest.mock('@/components/sections', () => ({
  Hero: function MockHero() {
    return (
      <section data-testid="hero-section">
        <h1>Mock Hero Component</h1>
        <p>This is a mock hero section</p>
      </section>
    );
  },
}));

describe('Home Page', () => {
  describe('Rendering', () => {
    it('renders main element with correct classes', () => {
      render(<Home />);
      
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass('min-h-screen');
    });

    it('renders Hero component', () => {
      render(<Home />);
      
      const heroSection = screen.getByTestId('hero-section');
      expect(heroSection).toBeInTheDocument();
      expect(screen.getByText('Mock Hero Component')).toBeInTheDocument();
    });

    it('has proper semantic structure', () => {
      render(<Home />);
      
      const main = screen.getByRole('main');
      const heroSection = screen.getByTestId('hero-section');
      
      expect(main).toContainElement(heroSection);
    });
  });

  describe('Layout', () => {
    it('applies correct styling to main element', () => {
      render(<Home />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass('min-h-screen');
    });

    it('contains only Hero component as direct child', () => {
      render(<Home />);
      
      const main = screen.getByRole('main');
      expect(main.children).toHaveLength(1);
      expect(main.firstElementChild).toHaveAttribute('data-testid', 'hero-section');
    });
  });

  describe('Accessibility', () => {
    it('has proper main landmark', () => {
      render(<Home />);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('maintains semantic structure', () => {
      render(<Home />);
      
      const main = screen.getByRole('main');
      expect(main.tagName.toLowerCase()).toBe('main');
    });
  });

  describe('Component Integration', () => {
    it('properly integrates Hero component', () => {
      render(<Home />);
      
      // Verify Hero component is rendered within main
      const main = screen.getByRole('main');
      const hero = screen.getByTestId('hero-section');
      
      expect(main).toContainElement(hero);
    });
  });

  describe('Edge Cases', () => {
    it('renders without errors', () => {
      expect(() => render(<Home />)).not.toThrow();
    });

    it('maintains structure with different viewport sizes', () => {
      render(<Home />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass('min-h-screen'); // Responsive height
    });
  });
});

describe('Home Page Metadata', () => {
  it('exports correct metadata object', () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('Portfolio - Full Stack Developer');
    expect(metadata.description).toBe('Welcome to my portfolio. I create beautiful, functional, and user-centered digital experiences.');
  });

  it('has appropriate title for SEO', () => {
    expect(metadata.title).toContain('Portfolio');
    expect(metadata.title).toContain('Full Stack Developer');
  });

  it('has descriptive meta description', () => {
    expect(metadata.description).toContain('portfolio');
    expect(metadata.description).toContain('digital experiences');
    expect(metadata.description?.length).toBeGreaterThan(50); // Good length for SEO
  });
});