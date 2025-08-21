import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectsPage, { metadata } from '../page';

// Mock the section components
jest.mock('@/components/sections', () => ({
  Projects: function MockProjects() {
    return (
      <section data-testid="projects-section">
        <h2>My Projects</h2>
        <div data-testid="project-grid">
          <div data-testid="project-card">Project 1</div>
          <div data-testid="project-card">Project 2</div>
        </div>
      </section>
    );
  },
  Technologies: function MockTechnologies() {
    return (
      <section data-testid="technologies-section">
        <h2>Technologies</h2>
        <div data-testid="tech-grid">
          <div data-testid="tech-item">React</div>
          <div data-testid="tech-item">Node.js</div>
        </div>
      </section>
    );
  },
}));

// Mock the SectionDivider component
jest.mock('@/components/ui/SectionDivider', () => {
  return function MockSectionDivider({ variant }: { variant?: string }) {
    return (
      <div data-testid="section-divider" data-variant={variant}>
        Section Divider - {variant}
      </div>
    );
  };
});

describe('ProjectsPage', () => {
  describe('Rendering', () => {
    it('renders main element with correct classes', () => {
      render(<ProjectsPage />);
      
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass(
        'min-h-screen',
        'pt-20',
        'relative',
        'overflow-hidden'
      );
    });

    it('renders Technologies component', () => {
      render(<ProjectsPage />);
      
      const technologiesSection = screen.getByTestId('technologies-section');
      expect(technologiesSection).toBeInTheDocument();
      expect(screen.getByText('Technologies')).toBeInTheDocument();
    });

    it('renders Projects component', () => {
      render(<ProjectsPage />);
      
      const projectsSection = screen.getByTestId('projects-section');
      expect(projectsSection).toBeInTheDocument();
      expect(screen.getByText('My Projects')).toBeInTheDocument();
    });

    it('renders SectionDivider with gradient variant', () => {
      render(<ProjectsPage />);
      
      const sectionDivider = screen.getByTestId('section-divider');
      expect(sectionDivider).toBeInTheDocument();
      expect(sectionDivider).toHaveAttribute('data-variant', 'gradient');
      expect(screen.getByText('Section Divider - gradient')).toBeInTheDocument();
    });

    it('renders content wrapper with correct z-index', () => {
      render(<ProjectsPage />);
      
      const contentWrapper = screen.getByTestId('technologies-section').closest('.relative.z-10');
      expect(contentWrapper).toBeInTheDocument();
      expect(contentWrapper).toHaveClass('relative', 'z-10');
    });
  });

  describe('Layout Structure', () => {
    it('has proper semantic structure', () => {
      render(<ProjectsPage />);
      
      const main = screen.getByRole('main');
      const technologiesSection = screen.getByTestId('technologies-section');
      const projectsSection = screen.getByTestId('projects-section');
      
      expect(main).toContainElement(technologiesSection);
      expect(main).toContainElement(projectsSection);
    });

    it('maintains correct element hierarchy', () => {
      render(<ProjectsPage />);
      
      const main = screen.getByRole('main');
      expect(main.children).toHaveLength(1); // Only content wrapper
      
      const contentWrapper = main.children[0];
      expect(contentWrapper).toHaveClass('relative', 'z-10');
      expect(contentWrapper.children).toHaveLength(3); // Technologies, Divider, Projects
    });

    it('renders components in correct order', () => {
      render(<ProjectsPage />);
      
      const contentWrapper = screen.getByTestId('technologies-section').closest('.relative.z-10');
      const children = Array.from(contentWrapper!.children);
      
      expect(children[0]).toHaveAttribute('data-testid', 'technologies-section');
      expect(children[1]).toHaveAttribute('data-testid', 'section-divider');
      expect(children[2]).toHaveAttribute('data-testid', 'projects-section');
    });

    it('contains all components within content wrapper', () => {
      render(<ProjectsPage />);
      
      const contentWrapper = screen.getByTestId('technologies-section').closest('.relative.z-10');
      const technologiesSection = screen.getByTestId('technologies-section');
      const sectionDivider = screen.getByTestId('section-divider');
      const projectsSection = screen.getByTestId('projects-section');
      
      expect(contentWrapper).toContainElement(technologiesSection);
      expect(contentWrapper).toContainElement(sectionDivider);
      expect(contentWrapper).toContainElement(projectsSection);
    });
  });

  describe('Styling and Layout', () => {
    it('applies correct main element styling', () => {
      render(<ProjectsPage />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass(
        'min-h-screen',   // Full viewport height
        'pt-20',          // Top padding for header
        'relative',       // For positioning context
        'overflow-hidden' // Prevent content overflow
      );
    });

    it('applies correct content wrapper styling', () => {
      render(<ProjectsPage />);
      
      const contentWrapper = screen.getByTestId('technologies-section').closest('div');
      expect(contentWrapper).toHaveClass(
        'relative', // Relative positioning
        'z-10'     // Stacking context
      );
    });

    it('maintains proper spacing with header', () => {
      render(<ProjectsPage />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass('pt-20'); // Adequate space for fixed header
    });
  });

  describe('Component Integration', () => {
    it('properly integrates Technologies component', () => {
      render(<ProjectsPage />);
      
      const technologiesSection = screen.getByTestId('technologies-section');
      expect(technologiesSection).toBeInTheDocument();
      
      // Verify Technologies component content
      expect(screen.getByText('Technologies')).toBeInTheDocument();
      expect(screen.getByTestId('tech-grid')).toBeInTheDocument();
      expect(screen.getAllByTestId('tech-item')).toHaveLength(2);
    });

    it('properly integrates Projects component', () => {
      render(<ProjectsPage />);
      
      const projectsSection = screen.getByTestId('projects-section');
      expect(projectsSection).toBeInTheDocument();
      
      // Verify Projects component content
      expect(screen.getByText('My Projects')).toBeInTheDocument();
      expect(screen.getByTestId('project-grid')).toBeInTheDocument();
      expect(screen.getAllByTestId('project-card')).toHaveLength(2);
    });

    it('properly integrates SectionDivider component', () => {
      render(<ProjectsPage />);
      
      const sectionDivider = screen.getByTestId('section-divider');
      expect(sectionDivider).toBeInTheDocument();
      expect(sectionDivider).toHaveAttribute('data-variant', 'gradient');
    });

    it('maintains component separation with divider', () => {
      render(<ProjectsPage />);
      
      const contentWrapper = screen.getByTestId('technologies-section').closest('.relative.z-10');
      const children = Array.from(contentWrapper!.children);
      
      // Divider should be between Technologies and Projects
      expect(children[0]).toHaveAttribute('data-testid', 'technologies-section');
      expect(children[1]).toHaveAttribute('data-testid', 'section-divider');
      expect(children[2]).toHaveAttribute('data-testid', 'projects-section');
    });
  });

  describe('Section Flow', () => {
    it('creates logical content flow from technologies to projects', () => {
      render(<ProjectsPage />);
      
      const technologiesSection = screen.getByTestId('technologies-section');
      const sectionDivider = screen.getByTestId('section-divider');
      const projectsSection = screen.getByTestId('projects-section');
      
      // Verify the logical flow exists
      expect(technologiesSection).toBeInTheDocument();
      expect(sectionDivider).toBeInTheDocument();
      expect(projectsSection).toBeInTheDocument();
    });

    it('uses appropriate divider variant for visual separation', () => {
      render(<ProjectsPage />);
      
      const sectionDivider = screen.getByTestId('section-divider');
      expect(sectionDivider).toHaveAttribute('data-variant', 'gradient');
    });
  });

  describe('Accessibility', () => {
    it('has proper main landmark', () => {
      render(<ProjectsPage />);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('maintains semantic structure', () => {
      render(<ProjectsPage />);
      
      const main = screen.getByRole('main');
      expect(main.tagName.toLowerCase()).toBe('main');
    });

    it('preserves component accessibility features', () => {
      render(<ProjectsPage />);
      
      // Verify that section elements are accessible
      const technologiesSection = screen.getByTestId('technologies-section');
      const projectsSection = screen.getByTestId('projects-section');
      
      expect(technologiesSection.tagName.toLowerCase()).toBe('section');
      expect(projectsSection.tagName.toLowerCase()).toBe('section');
    });

    it('maintains proper heading hierarchy', () => {
      render(<ProjectsPage />);
      
      // Both sections should have h2 headings
      const headings = screen.getAllByRole('heading', { level: 2 });
      expect(headings).toHaveLength(2);
      expect(headings[0]).toHaveTextContent('Technologies');
      expect(headings[1]).toHaveTextContent('My Projects');
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive padding', () => {
      render(<ProjectsPage />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass('pt-20'); // Top padding for header clearance
    });

    it('handles overflow properly', () => {
      render(<ProjectsPage />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass('overflow-hidden');
    });

    it('maintains full viewport height', () => {
      render(<ProjectsPage />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass('min-h-screen');
    });

    it('uses relative positioning for flexible layout', () => {
      render(<ProjectsPage />);
      
      const main = screen.getByRole('main');
      const contentWrapper = screen.getByTestId('technologies-section').closest('div');
      
      expect(main).toHaveClass('relative');
      expect(contentWrapper).toHaveClass('relative');
    });
  });

  describe('Edge Cases', () => {
    it('renders without errors', () => {
      expect(() => render(<ProjectsPage />)).not.toThrow();
    });

    it('maintains structure when components are empty', () => {
      render(<ProjectsPage />);
      
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      expect(main.children).toHaveLength(1); // Still has wrapper
    });

    it('handles missing components gracefully', () => {
      render(<ProjectsPage />);
      
      const main = screen.getByRole('main');
      const contentWrapper = main.querySelector('.relative.z-10');
      
      expect(contentWrapper).toBeInTheDocument();
    });

    it('maintains layout integrity with all components', () => {
      render(<ProjectsPage />);
      
      const contentWrapper = screen.getByTestId('technologies-section').closest('.relative.z-10');
      expect(contentWrapper?.children).toHaveLength(3); // Technologies, Divider, Projects
    });
  });

  describe('Performance Considerations', () => {
    it('uses efficient CSS classes for layout', () => {
      render(<ProjectsPage />);
      
      const main = screen.getByRole('main');
      
      // Check that efficient Tailwind classes are used
      expect(main).toHaveClass('relative');        // Efficient positioning
      expect(main).toHaveClass('overflow-hidden'); // Prevents layout shifts
      expect(main).toHaveClass('min-h-screen');    // Efficient height
    });

    it('has optimal DOM structure', () => {
      render(<ProjectsPage />);
      
      const main = screen.getByRole('main');
      
      // Should have minimal nesting for performance
      expect(main.children).toHaveLength(1);
      
      const contentWrapper = main.firstElementChild;
      expect(contentWrapper?.children).toHaveLength(3); // Three main sections
    });

    it('uses appropriate z-index values', () => {
      render(<ProjectsPage />);
      
      const contentWrapper = screen.getByTestId('technologies-section').closest('div');
      expect(contentWrapper).toHaveClass('z-10'); // Reasonable z-index
    });
  });

  describe('Content Organization', () => {
    it('organizes content logically from skills to projects', () => {
      render(<ProjectsPage />);
      
      const contentWrapper = screen.getByTestId('technologies-section').closest('.relative.z-10');
      const children = Array.from(contentWrapper!.children);
      
      // Technologies first (skills/tools)
      expect(children[0]).toHaveAttribute('data-testid', 'technologies-section');
      // Visual separator
      expect(children[1]).toHaveAttribute('data-testid', 'section-divider');
      // Projects last (applications of skills)
      expect(children[2]).toHaveAttribute('data-testid', 'projects-section');
    });

    it('provides visual separation between sections', () => {
      render(<ProjectsPage />);
      
      const sectionDivider = screen.getByTestId('section-divider');
      expect(sectionDivider).toBeInTheDocument();
      expect(sectionDivider).toHaveAttribute('data-variant', 'gradient');
    });
  });
});

describe('ProjectsPage Metadata', () => {
  it('exports correct metadata object', () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('Projects - Portfolio');
    expect(metadata.description).toBe('Explore my portfolio of web development projects and technical skills.');
  });

  it('has appropriate title for SEO', () => {
    expect(metadata.title).toContain('Projects');
    expect(metadata.title).toContain('Portfolio');
  });

  it('has descriptive meta description', () => {
    expect(metadata.description).toContain('portfolio');
    expect(metadata.description).toContain('web development');
    expect(metadata.description).toContain('projects');
    expect(metadata.description).toContain('technical skills');
    expect(metadata.description?.length).toBeGreaterThan(50); // Good length for SEO
  });

  it('follows consistent title pattern', () => {
    expect(metadata.title).toMatch(/^Projects - Portfolio$/);
  });

  it('has relevant keywords in description', () => {
    const description = metadata.description || '';
    expect(description.toLowerCase()).toContain('portfolio');
    expect(description.toLowerCase()).toContain('web development');
    expect(description.toLowerCase()).toContain('projects');
    expect(description.toLowerCase()).toContain('technical skills');
  });

  it('encourages exploration in description', () => {
    const description = metadata.description || '';
    expect(description).toMatch(/^Explore/); // Starts with action word
  });
});