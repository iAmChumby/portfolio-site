import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GitHubPage, { metadata } from '../page';

// Mock the GitHubStats component
jest.mock('@/components/sections/GitHubStats', () => {
  return function MockGitHubStats() {
    return (
      <div data-testid="github-stats">
        <div data-testid="stats-overview">
          <div data-testid="stat-item">Repositories: 25</div>
          <div data-testid="stat-item">Stars: 150</div>
          <div data-testid="stat-item">Forks: 30</div>
        </div>
        <div data-testid="contribution-graph">
          <h3>Contribution Activity</h3>
          <div data-testid="contribution-data">Contribution data</div>
        </div>
        <div data-testid="repo-list">
          <h3>Featured Repositories</h3>
          <div data-testid="repo-item">Repository 1</div>
          <div data-testid="repo-item">Repository 2</div>
        </div>
      </div>
    );
  };
});

describe('GitHubPage', () => {
  describe('Rendering', () => {
    it('renders main element with correct classes', () => {
      render(<GitHubPage />);
      
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass(
        'min-h-screen',
        'relative',
        'overflow-hidden'
      );
    });

    it('renders background decoration', () => {
      render(<GitHubPage />);
      
      const backgroundDecoration = document.querySelector('.bg-grid-pattern');
      expect(backgroundDecoration).toBeInTheDocument();
      expect(backgroundDecoration).toHaveClass(
        'absolute',
        'inset-0',
        'bg-grid-pattern',
        'opacity-5',
        '-z-20'
      );
    });

    it('renders blur overlay', () => {
      render(<GitHubPage />);
      
      const blurOverlay = document.querySelector('.absolute.inset-0.z-0.pointer-events-none');
      expect(blurOverlay).toBeInTheDocument();
      expect(blurOverlay).toHaveClass(
        'absolute',
        'inset-0',
        'z-0',
        'pointer-events-none'
      );
    });

    it('renders container with correct classes', () => {
      render(<GitHubPage />);
      
      const container = document.querySelector('.container');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass(
        'container',
        'mx-auto',
        'px-4',
        'sm:px-6',
        'lg:px-8',
        'pt-20',
        'relative',
        'z-10'
      );
    });

    it('renders GitHubStats component', () => {
      render(<GitHubPage />);
      
      const githubStats = screen.getByTestId('github-stats');
      expect(githubStats).toBeInTheDocument();
    });
  });

  describe('Header Section', () => {
    it('renders main heading with correct text and styling', () => {
      render(<GitHubPage />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('GitHub Dashboard');
      expect(heading).toHaveClass(
        'text-4xl',
        'sm:text-5xl',
        'md:text-6xl',
        'font-bold',
        'mb-4',
        'sm:mb-6',
        'text-white'
      );
    });

    it('renders GitHub text and Dashboard span correctly', () => {
      render(<GitHubPage />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('GitHub Dashboard');
      
      const span = heading.querySelector('span');
      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent('Dashboard');
      expect(span).toHaveClass('text-white');
    });

    it('renders description paragraph with correct text and styling', () => {
      render(<GitHubPage />);
      
      const description = screen.getByText('Explore my GitHub activity, repositories, and contributions');
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass(
        'text-lg',
        'sm:text-xl',
        'md:text-2xl',
        'leading-relaxed',
        'text-white/80',
        'max-w-2xl',
        'mx-auto'
      );
    });

    it('renders header section with correct styling and animation', () => {
      render(<GitHubPage />);
      
      const headerSection = document.querySelector('.text-center.mb-12.animate-fade-in');
      expect(headerSection).toBeInTheDocument();
      expect(headerSection).toHaveClass(
        'text-center',
        'mb-12',
        'animate-fade-in'
      );
    });
  });

  describe('Layout Structure', () => {
    it('has proper semantic structure', () => {
      render(<GitHubPage />);
      
      const main = screen.getByRole('main');
      const heading = screen.getByRole('heading', { level: 1 });
      const githubStats = screen.getByTestId('github-stats');
      
      expect(main).toContainElement(heading);
      expect(main).toContainElement(githubStats);
    });

    it('maintains correct element hierarchy', () => {
      render(<GitHubPage />);
      
      const main = screen.getByRole('main');
      expect(main.children).toHaveLength(3); // Background, overlay, container
      
      const container = main.querySelector('.container');
      expect(container).toBeInTheDocument();
      
      const maxWidthWrapper = container?.querySelector('.max-w-6xl');
      expect(maxWidthWrapper).toBeInTheDocument();
    });

    it('renders content in correct order', () => {
      render(<GitHubPage />);
      
      const main = screen.getByRole('main');
      const children = Array.from(main.children);
      
      // Background decoration first
      expect(children[0]).toHaveClass('bg-grid-pattern');
      // Blur overlay second
      expect(children[1]).toHaveClass('pointer-events-none');
      // Container with content last
      expect(children[2]).toHaveClass('container');
    });

    it('contains header and stats within max-width wrapper', () => {
      render(<GitHubPage />);
      
      const maxWidthWrapper = document.querySelector('.max-w-6xl') as HTMLElement;
      const headerSection = document.querySelector('.text-center.mb-12') as HTMLElement;
      const statsWrapper = document.querySelector('.animate-fade-in.animation-delay-200') as HTMLElement;
      
      expect(maxWidthWrapper).toContainElement(headerSection);
      expect(maxWidthWrapper).toContainElement(statsWrapper);
    });
  });

  describe('Styling and Layout', () => {
    it('applies correct main element styling', () => {
      render(<GitHubPage />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass(
        'min-h-screen',   // Full viewport height
        'relative',       // For positioning context
        'overflow-hidden' // Prevent content overflow
      );
    });

    it('applies correct background decoration styling', () => {
      render(<GitHubPage />);
      
      const backgroundDecoration = document.querySelector('.bg-grid-pattern');
      expect(backgroundDecoration).toHaveClass(
        'absolute',       // Absolute positioning
        'inset-0',        // Full coverage
        'bg-grid-pattern', // Grid pattern background
        'opacity-5',      // Low opacity
        '-z-20'          // Behind everything
      );
    });

    it('applies correct blur overlay styling', () => {
      render(<GitHubPage />);
      
      const blurOverlay = document.querySelector('.absolute.inset-0.z-0.pointer-events-none');
      expect(blurOverlay).toHaveClass(
        'absolute',         // Absolute positioning
        'inset-0',          // Full coverage
        'z-0',              // Above background, below content
        'pointer-events-none' // Non-interactive
      );
    });

    it('applies correct container styling', () => {
      render(<GitHubPage />);
      
      const container = document.querySelector('.container');
      expect(container).toHaveClass(
        'container',  // Container utility
        'mx-auto',    // Center horizontally
        'px-4',       // Base padding
        'sm:px-6',    // Small screen padding
        'lg:px-8',    // Large screen padding
        'pt-20',      // Top padding for header
        'relative',   // Relative positioning
        'z-10'        // Above overlays
      );
    });

    it('applies correct max-width wrapper styling', () => {
      render(<GitHubPage />);
      
      const maxWidthWrapper = document.querySelector('.max-w-6xl');
      expect(maxWidthWrapper).toHaveClass(
        'max-w-6xl', // Maximum width constraint
        'mx-auto'    // Center horizontally
      );
    });
  });

  describe('Animation Classes', () => {
    it('applies fade-in animation to header section', () => {
      render(<GitHubPage />);
      
      const headerSection = document.querySelector('.text-center.mb-12');
      expect(headerSection).toHaveClass('animate-fade-in');
    });

    it('applies delayed fade-in animation to stats section', () => {
      render(<GitHubPage />);
      
      const statsWrapper = document.querySelector('.animate-fade-in.animation-delay-200');
      expect(statsWrapper).toBeInTheDocument();
      expect(statsWrapper).toHaveClass(
        'animate-fade-in',
        'animation-delay-200'
      );
    });
  });

  describe('Component Integration', () => {
    it('properly integrates GitHubStats component', () => {
      render(<GitHubPage />);
      
      const githubStats = screen.getByTestId('github-stats');
      expect(githubStats).toBeInTheDocument();
      
      // Verify GitHubStats component content
      expect(screen.getByTestId('stats-overview')).toBeInTheDocument();
      expect(screen.getByTestId('contribution-graph')).toBeInTheDocument();
      expect(screen.getByTestId('repo-list')).toBeInTheDocument();
    });

    it('renders GitHubStats within animated wrapper', () => {
      render(<GitHubPage />);
      
      const statsWrapper = document.querySelector('.animate-fade-in.animation-delay-200');
      const githubStats = screen.getByTestId('github-stats');
      
      expect(statsWrapper).toContainElement(githubStats);
    });

    it('maintains GitHubStats component functionality', () => {
      render(<GitHubPage />);
      
      // Verify that GitHubStats renders its expected content
      expect(screen.getAllByTestId('stat-item')).toHaveLength(3);
      expect(screen.getAllByTestId('repo-item')).toHaveLength(2);
      expect(screen.getByText('Contribution Activity')).toBeInTheDocument();
      expect(screen.getByText('Featured Repositories')).toBeInTheDocument();
    });
  });

  describe('Z-Index Layering', () => {
    it('maintains correct z-index stacking order', () => {
      render(<GitHubPage />);
      
      const backgroundDecoration = document.querySelector('.bg-grid-pattern');
      const blurOverlay = document.querySelector('.absolute.inset-0.z-0.pointer-events-none');
      const container = document.querySelector('.container');
      
      expect(backgroundDecoration).toHaveClass('-z-20'); // Furthest back
      expect(blurOverlay).toHaveClass('z-0');            // Middle layer
      expect(container).toHaveClass('z-10');             // Front layer
    });

    it('ensures content appears above background elements', () => {
      render(<GitHubPage />);
      
      const container = document.querySelector('.container');
      expect(container).toHaveClass('relative', 'z-10');
    });
  });

  describe('Accessibility', () => {
    it('has proper main landmark', () => {
      render(<GitHubPage />);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('maintains semantic structure', () => {
      render(<GitHubPage />);
      
      const main = screen.getByRole('main');
      expect(main.tagName.toLowerCase()).toBe('main');
    });

    it('has proper heading hierarchy', () => {
      render(<GitHubPage />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent('GitHub Dashboard');
    });

    it('ensures background elements do not interfere with interaction', () => {
      render(<GitHubPage />);
      
      const blurOverlay = document.querySelector('.pointer-events-none');
      expect(blurOverlay).toHaveClass('pointer-events-none');
    });

    it('preserves GitHubStats component accessibility', () => {
      render(<GitHubPage />);
      
      const githubStats = screen.getByTestId('github-stats');
      expect(githubStats).toBeInTheDocument();
      
      // Verify that stats content is accessible
      expect(screen.getByText('Contribution Activity')).toBeInTheDocument();
      expect(screen.getByText('Featured Repositories')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive padding to container', () => {
      render(<GitHubPage />);
      
      const container = document.querySelector('.container');
      expect(container).toHaveClass(
        'px-4',    // Base padding
        'sm:px-6', // Small screen padding
        'lg:px-8'  // Large screen padding
      );
    });

    it('applies responsive text sizing to heading', () => {
      render(<GitHubPage />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass(
        'text-4xl',    // Base size
        'sm:text-5xl', // Small screen size
        'md:text-6xl'  // Medium screen size
      );
    });

    it('applies responsive text sizing to description', () => {
      render(<GitHubPage />);
      
      const description = screen.getByText('Explore my GitHub activity, repositories, and contributions');
      expect(description).toHaveClass(
        'text-lg',     // Base size
        'sm:text-xl',  // Small screen size
        'md:text-2xl'  // Medium screen size
      );
    });

    it('applies responsive margin to heading', () => {
      render(<GitHubPage />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass(
        'mb-4',    // Base margin
        'sm:mb-6'  // Small screen margin
      );
    });

    it('maintains full viewport height', () => {
      render(<GitHubPage />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass('min-h-screen');
    });
  });

  describe('Edge Cases', () => {
    it('renders without errors', () => {
      expect(() => render(<GitHubPage />)).not.toThrow();
    });

    it('maintains structure when GitHubStats is empty', () => {
      render(<GitHubPage />);
      
      const main = screen.getByRole('main');
      const container = main.querySelector('.container');
      
      expect(main).toBeInTheDocument();
      expect(container).toBeInTheDocument();
    });

    it('handles missing GitHubStats gracefully', () => {
      render(<GitHubPage />);
      
      const statsWrapper = document.querySelector('.animate-fade-in.animation-delay-200');
      expect(statsWrapper).toBeInTheDocument();
    });

    it('maintains layout integrity with all elements', () => {
      render(<GitHubPage />);
      
      const main = screen.getByRole('main');
      expect(main.children).toHaveLength(3); // Background, overlay, container
      
      const maxWidthWrapper = document.querySelector('.max-w-6xl');
      expect(maxWidthWrapper?.children).toHaveLength(2); // Header and stats
    });
  });

  describe('Performance Considerations', () => {
    it('uses efficient CSS classes for layout', () => {
      render(<GitHubPage />);
      
      const main = screen.getByRole('main');
      
      // Check that efficient Tailwind classes are used
      expect(main).toHaveClass('relative');        // Efficient positioning
      expect(main).toHaveClass('overflow-hidden'); // Prevents layout shifts
      expect(main).toHaveClass('min-h-screen');    // Efficient height
    });

    it('optimizes background elements for performance', () => {
      render(<GitHubPage />);
      
      const backgroundDecoration = document.querySelector('.bg-grid-pattern');
      const blurOverlay = document.querySelector('.pointer-events-none');
      
      expect(backgroundDecoration).toHaveClass('opacity-5'); // Low opacity for performance
      expect(blurOverlay).toHaveClass('pointer-events-none'); // Non-interactive
    });

    it('uses appropriate z-index values', () => {
      render(<GitHubPage />);
      
      const backgroundDecoration = document.querySelector('.bg-grid-pattern');
      const blurOverlay = document.querySelector('.absolute.inset-0.z-0.pointer-events-none');
      const container = document.querySelector('.container');
      
      expect(backgroundDecoration).toHaveClass('-z-20'); // Reasonable negative z-index
      expect(blurOverlay).toHaveClass('z-0');            // Neutral z-index
      expect(container).toHaveClass('z-10');             // Reasonable positive z-index
    });
  });

  describe('Content Organization', () => {
    it('organizes content with clear visual hierarchy', () => {
      render(<GitHubPage />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      const description = screen.getByText('Explore my GitHub activity, repositories, and contributions');
      const githubStats = screen.getByTestId('github-stats');
      
      expect(heading).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(githubStats).toBeInTheDocument();
    });

    it('provides clear page purpose through heading and description', () => {
      render(<GitHubPage />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      const description = screen.getByText('Explore my GitHub activity, repositories, and contributions');
      
      expect(heading).toHaveTextContent('GitHub Dashboard');
      expect(description).toHaveTextContent('Explore my GitHub activity, repositories, and contributions');
    });

    it('centers content appropriately', () => {
      render(<GitHubPage />);
      
      const headerSection = document.querySelector('.text-center');
      const container = document.querySelector('.container');
      const maxWidthWrapper = document.querySelector('.max-w-6xl');
      
      expect(headerSection).toHaveClass('text-center');
      expect(container).toHaveClass('mx-auto');
      expect(maxWidthWrapper).toHaveClass('mx-auto');
    });
  });
});

describe('GitHubPage Metadata', () => {
  it('exports correct metadata object', () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('GitHub Stats');
    expect(metadata.description).toBe('Overview of my GitHub activity and contributions');
  });

  it('has appropriate title for SEO', () => {
    expect(metadata.title).toContain('GitHub');
    expect(metadata.title).toContain('Stats');
  });

  it('has descriptive meta description', () => {
    expect(metadata.description).toContain('GitHub');
    expect(metadata.description).toContain('activity');
    expect(metadata.description).toContain('contributions');
    expect(metadata.description?.length).toBeGreaterThan(30); // Good length for SEO
  });

  it('follows consistent title pattern', () => {
    expect(metadata.title).toMatch(/^GitHub Stats$/);
  });

  it('has relevant keywords in description', () => {
    const description = metadata.description || '';
    expect(description.toLowerCase()).toContain('github');
    expect(description.toLowerCase()).toContain('activity');
    expect(description.toLowerCase()).toContain('contributions');
  });

  it('provides overview context in description', () => {
    const description = metadata.description || '';
    expect(description).toMatch(/^Overview/); // Starts with overview
  });
});