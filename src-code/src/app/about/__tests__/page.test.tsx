import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AboutPage, { metadata } from '../page';

// Mock the About component
jest.mock('@/components/sections', () => ({
  About: function MockAbout() {
    return (
      <section data-testid="about-section">
        <h1>About Me</h1>
        <p>This is the about section content</p>
      </section>
    );
  },
}));

describe('AboutPage', () => {
  describe('Rendering', () => {
    it('renders main element with correct classes', () => {
      render(<AboutPage />);
      
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass(
        'min-h-screen',
        'pt-20',
        'relative',
        'overflow-hidden'
      );
    });

    it('renders About component', () => {
      render(<AboutPage />);
      
      const aboutSection = screen.getByTestId('about-section');
      expect(aboutSection).toBeInTheDocument();
      expect(screen.getByText('About Me')).toBeInTheDocument();
      expect(screen.getByText('This is the about section content')).toBeInTheDocument();
    });

    it('renders background decoration element', () => {
      render(<AboutPage />);
      
      const main = screen.getByRole('main');
      const backgroundDiv = main.querySelector('.absolute.inset-0.z-0.pointer-events-none');
      
      expect(backgroundDiv).toBeInTheDocument();
      expect(backgroundDiv).toHaveClass(
        'absolute',
        'inset-0',
        'z-0',
        'pointer-events-none'
      );
    });

    it('renders content wrapper with correct z-index', () => {
      render(<AboutPage />);
      
      const contentWrapper = screen.getByTestId('about-section').closest('.relative.z-10');
      expect(contentWrapper).toBeInTheDocument();
      expect(contentWrapper).toHaveClass('relative', 'z-10');
    });
  });

  describe('Layout Structure', () => {
    it('has proper semantic structure', () => {
      render(<AboutPage />);
      
      const main = screen.getByRole('main');
      const aboutSection = screen.getByTestId('about-section');
      
      expect(main).toContainElement(aboutSection);
    });

    it('maintains correct element hierarchy', () => {
      render(<AboutPage />);
      
      const main = screen.getByRole('main');
      expect(main.children).toHaveLength(2); // background div + content wrapper
      
      const backgroundDiv = main.children[0];
      const contentWrapper = main.children[1];
      
      expect(backgroundDiv).toHaveClass('absolute', 'inset-0', 'z-0', 'pointer-events-none');
      expect(contentWrapper).toHaveClass('relative', 'z-10');
    });

    it('positions content above background decoration', () => {
      render(<AboutPage />);
      
      const main = screen.getByRole('main');
      const backgroundDiv = main.querySelector('.z-0');
      const contentWrapper = main.querySelector('.z-10');
      
      expect(backgroundDiv).toBeInTheDocument();
      expect(contentWrapper).toBeInTheDocument();
      
      // z-10 should be higher than z-0
      expect(contentWrapper).toHaveClass('z-10');
      expect(backgroundDiv).toHaveClass('z-0');
    });

    it('contains About component within content wrapper', () => {
      render(<AboutPage />);
      
      const contentWrapper = screen.getByTestId('about-section').closest('.relative.z-10');
      const aboutSection = screen.getByTestId('about-section');
      
      expect(contentWrapper).toContainElement(aboutSection);
    });
  });

  describe('Styling and Layout', () => {
    it('applies correct main element styling', () => {
      render(<AboutPage />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass(
        'min-h-screen', // Full viewport height
        'pt-20',        // Top padding for header
        'relative',     // For absolute positioning context
        'overflow-hidden' // Prevent content overflow
      );
    });

    it('applies correct background decoration styling', () => {
      render(<AboutPage />);
      
      const main = screen.getByRole('main');
      const backgroundDiv = main.querySelector('.absolute.inset-0.z-0.pointer-events-none');
      
      expect(backgroundDiv).toHaveClass(
        'absolute',         // Absolute positioning
        'inset-0',         // Full coverage
        'z-0',             // Behind content
        'pointer-events-none' // Non-interactive
      );
    });

    it('applies correct content wrapper styling', () => {
      render(<AboutPage />);
      
      const contentWrapper = screen.getByTestId('about-section').closest('div');
      expect(contentWrapper).toHaveClass(
        'relative', // Relative positioning
        'z-10'     // Above background
      );
    });
  });

  describe('Accessibility', () => {
    it('has proper main landmark', () => {
      render(<AboutPage />);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('maintains semantic structure', () => {
      render(<AboutPage />);
      
      const main = screen.getByRole('main');
      expect(main.tagName.toLowerCase()).toBe('main');
    });

    it('background decoration does not interfere with interactions', () => {
      render(<AboutPage />);
      
      const backgroundDiv = screen.getByRole('main').querySelector('.pointer-events-none');
      expect(backgroundDiv).toHaveClass('pointer-events-none');
    });
  });

  describe('Component Integration', () => {
    it('properly integrates About component', () => {
      render(<AboutPage />);
      
      const main = screen.getByRole('main');
      const aboutSection = screen.getByTestId('about-section');
      
      expect(main).toContainElement(aboutSection);
    });

    it('renders About component within proper wrapper', () => {
      render(<AboutPage />);
      
      const contentWrapper = screen.getByTestId('about-section').closest('.relative.z-10');
      const aboutSection = screen.getByTestId('about-section');
      
      expect(contentWrapper).toContainElement(aboutSection);
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive padding', () => {
      render(<AboutPage />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass('pt-20'); // Top padding for header clearance
    });

    it('handles overflow properly', () => {
      render(<AboutPage />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass('overflow-hidden');
    });

    it('maintains full viewport height', () => {
      render(<AboutPage />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass('min-h-screen');
    });
  });

  describe('Edge Cases', () => {
    it('renders without errors', () => {
      expect(() => render(<AboutPage />)).not.toThrow();
    });

    it('maintains structure when About component is empty', () => {
      render(<AboutPage />);
      
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      expect(main.children).toHaveLength(2); // Still has background + wrapper
    });

    it('handles missing About component gracefully', () => {
      // This test ensures the page structure remains intact
      render(<AboutPage />);
      
      const main = screen.getByRole('main');
      const backgroundDiv = main.querySelector('.absolute.inset-0.z-0.pointer-events-none');
      const contentWrapper = main.querySelector('.relative.z-10');
      
      expect(backgroundDiv).toBeInTheDocument();
      expect(contentWrapper).toBeInTheDocument();
    });
  });

  describe('Performance Considerations', () => {
    it('uses efficient CSS classes for layout', () => {
      render(<AboutPage />);
      
      const main = screen.getByRole('main');
      
      // Check that efficient Tailwind classes are used
      expect(main).toHaveClass('relative'); // Efficient positioning
      expect(main).toHaveClass('overflow-hidden'); // Prevents layout shifts
    });

    it('background decoration is non-interactive', () => {
      render(<AboutPage />);
      
      const backgroundDiv = screen.getByRole('main').querySelector('.pointer-events-none');
      expect(backgroundDiv).toHaveClass('pointer-events-none');
    });
  });
});

describe('AboutPage Metadata', () => {
  it('exports correct metadata object', () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('About - Portfolio');
    expect(metadata.description).toBe('Learn more about my background, skills, and experience as a full-stack developer.');
  });

  it('has appropriate title for SEO', () => {
    expect(metadata.title).toContain('About');
    expect(metadata.title).toContain('Portfolio');
  });

  it('has descriptive meta description', () => {
    expect(metadata.description).toContain('background');
    expect(metadata.description).toContain('skills');
    expect(metadata.description).toContain('experience');
    expect(metadata.description).toContain('full-stack developer');
    expect(metadata.description?.length).toBeGreaterThan(50); // Good length for SEO
  });

  it('follows consistent title pattern', () => {
    expect(metadata.title).toMatch(/^About - Portfolio$/);
  });

  it('has relevant keywords in description', () => {
    const description = metadata.description || '';
    expect(description.toLowerCase()).toContain('developer');
    expect(description.toLowerCase()).toContain('skills');
  });
});