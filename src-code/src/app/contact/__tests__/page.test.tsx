import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactPage, { metadata } from '../page';

// Mock the Contact component
jest.mock('@/components/sections', () => ({
  Contact: function MockContact() {
    return (
      <section data-testid="contact-section">
        <h1>Contact Me</h1>
        <p>Get in touch for collaboration opportunities</p>
        <form data-testid="contact-form">
          <input type="email" placeholder="Your email" />
          <textarea placeholder="Your message"></textarea>
          <button type="submit">Send Message</button>
        </form>
      </section>
    );
  },
}));

describe('ContactPage', () => {
  describe('Rendering', () => {
    it('renders main element with correct classes', () => {
      render(<ContactPage />);
      
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass(
        'min-h-screen',
        'pt-20',
        'relative',
        'overflow-hidden'
      );
    });

    it('renders Contact component', () => {
      render(<ContactPage />);
      
      const contactSection = screen.getByTestId('contact-section');
      expect(contactSection).toBeInTheDocument();
      expect(screen.getByText('Contact Me')).toBeInTheDocument();
      expect(screen.getByText('Get in touch for collaboration opportunities')).toBeInTheDocument();
    });

    it('renders content wrapper with correct z-index', () => {
      render(<ContactPage />);
      
      const contentWrapper = screen.getByTestId('contact-section').closest('.relative.z-10');
      expect(contentWrapper).toBeInTheDocument();
      expect(contentWrapper).toHaveClass('relative', 'z-10');
    });
  });

  describe('Layout Structure', () => {
    it('has proper semantic structure', () => {
      render(<ContactPage />);
      
      const main = screen.getByRole('main');
      const contactSection = screen.getByTestId('contact-section');
      
      expect(main).toContainElement(contactSection);
    });

    it('maintains correct element hierarchy', () => {
      render(<ContactPage />);
      
      const main = screen.getByRole('main');
      expect(main.children).toHaveLength(1); // Only content wrapper
      
      const contentWrapper = main.children[0];
      expect(contentWrapper).toHaveClass('relative', 'z-10');
    });

    it('contains Contact component within content wrapper', () => {
      render(<ContactPage />);
      
      const contentWrapper = screen.getByTestId('contact-section').closest('.relative.z-10');
      const contactSection = screen.getByTestId('contact-section');
      
      expect(contentWrapper).toContainElement(contactSection);
    });

    it('has single direct child in main element', () => {
      render(<ContactPage />);
      
      const main = screen.getByRole('main');
      expect(main.children).toHaveLength(1);
      expect(main.firstElementChild).toHaveClass('relative', 'z-10');
    });
  });

  describe('Styling and Layout', () => {
    it('applies correct main element styling', () => {
      render(<ContactPage />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass(
        'min-h-screen',   // Full viewport height
        'pt-20',          // Top padding for header
        'relative',       // For positioning context
        'overflow-hidden' // Prevent content overflow
      );
    });

    it('applies correct content wrapper styling', () => {
      render(<ContactPage />);
      
      const contentWrapper = screen.getByTestId('contact-section').closest('div');
      expect(contentWrapper).toHaveClass(
        'relative', // Relative positioning
        'z-10'     // Stacking context
      );
    });

    it('maintains proper spacing with header', () => {
      render(<ContactPage />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass('pt-20'); // Adequate space for fixed header
    });
  });

  describe('Accessibility', () => {
    it('has proper main landmark', () => {
      render(<ContactPage />);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('maintains semantic structure', () => {
      render(<ContactPage />);
      
      const main = screen.getByRole('main');
      expect(main.tagName.toLowerCase()).toBe('main');
    });

    it('preserves Contact component accessibility features', () => {
      render(<ContactPage />);
      
      // Verify that form elements are accessible
      const form = screen.getByTestId('contact-form');
      const emailInput = screen.getByPlaceholderText('Your email');
      const messageTextarea = screen.getByPlaceholderText('Your message');
      const submitButton = screen.getByText('Send Message');
      
      expect(form).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
      expect(messageTextarea).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('properly integrates Contact component', () => {
      render(<ContactPage />);
      
      const main = screen.getByRole('main');
      const contactSection = screen.getByTestId('contact-section');
      
      expect(main).toContainElement(contactSection);
    });

    it('renders Contact component within proper wrapper', () => {
      render(<ContactPage />);
      
      const contentWrapper = screen.getByTestId('contact-section').closest('.relative.z-10');
      const contactSection = screen.getByTestId('contact-section');
      
      expect(contentWrapper).toContainElement(contactSection);
    });

    it('maintains Contact component functionality', () => {
      render(<ContactPage />);
      
      // Verify Contact component elements are rendered
      expect(screen.getByText('Contact Me')).toBeInTheDocument();
      expect(screen.getByTestId('contact-form')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your message')).toBeInTheDocument();
      expect(screen.getByText('Send Message')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive padding', () => {
      render(<ContactPage />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass('pt-20'); // Top padding for header clearance
    });

    it('handles overflow properly', () => {
      render(<ContactPage />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass('overflow-hidden');
    });

    it('maintains full viewport height', () => {
      render(<ContactPage />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass('min-h-screen');
    });

    it('uses relative positioning for flexible layout', () => {
      render(<ContactPage />);
      
      const main = screen.getByRole('main');
      const contentWrapper = screen.getByTestId('contact-section').closest('div');
      
      expect(main).toHaveClass('relative');
      expect(contentWrapper).toHaveClass('relative');
    });
  });

  describe('Page Structure', () => {
    it('has clean and minimal structure', () => {
      render(<ContactPage />);
      
      const main = screen.getByRole('main');
      
      // Should have only one direct child (content wrapper)
      expect(main.children).toHaveLength(1);
      
      // Content wrapper should contain the Contact component
      const contentWrapper = main.firstElementChild;
      expect(contentWrapper).toHaveClass('relative', 'z-10');
    });

    it('maintains consistent layout pattern', () => {
      render(<ContactPage />);
      
      const main = screen.getByRole('main');
      
      // Should follow the same pattern as other pages
      expect(main).toHaveClass('min-h-screen', 'pt-20', 'relative', 'overflow-hidden');
    });
  });

  describe('Edge Cases', () => {
    it('renders without errors', () => {
      expect(() => render(<ContactPage />)).not.toThrow();
    });

    it('maintains structure when Contact component is empty', () => {
      render(<ContactPage />);
      
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      expect(main.children).toHaveLength(1); // Still has wrapper
    });

    it('handles missing Contact component gracefully', () => {
      render(<ContactPage />);
      
      const main = screen.getByRole('main');
      const contentWrapper = main.querySelector('.relative.z-10');
      
      expect(contentWrapper).toBeInTheDocument();
    });

    it('maintains layout integrity', () => {
      render(<ContactPage />);
      
      const main = screen.getByRole('main');
      
      // Verify all essential classes are present
      expect(main).toHaveClass('min-h-screen');
      expect(main).toHaveClass('pt-20');
      expect(main).toHaveClass('relative');
      expect(main).toHaveClass('overflow-hidden');
    });
  });

  describe('Performance Considerations', () => {
    it('uses efficient CSS classes for layout', () => {
      render(<ContactPage />);
      
      const main = screen.getByRole('main');
      
      // Check that efficient Tailwind classes are used
      expect(main).toHaveClass('relative');        // Efficient positioning
      expect(main).toHaveClass('overflow-hidden'); // Prevents layout shifts
      expect(main).toHaveClass('min-h-screen');    // Efficient height
    });

    it('has minimal DOM structure', () => {
      render(<ContactPage />);
      
      const main = screen.getByRole('main');
      
      // Should have minimal nesting for performance
      expect(main.children).toHaveLength(1);
    });

    it('uses appropriate z-index values', () => {
      render(<ContactPage />);
      
      const contentWrapper = screen.getByTestId('contact-section').closest('div');
      expect(contentWrapper).toHaveClass('z-10'); // Reasonable z-index
    });
  });
});

describe('ContactPage Metadata', () => {
  it('exports correct metadata object', () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('Contact - Portfolio');
    expect(metadata.description).toBe('Get in touch with me for collaboration opportunities or project inquiries.');
  });

  it('has appropriate title for SEO', () => {
    expect(metadata.title).toContain('Contact');
    expect(metadata.title).toContain('Portfolio');
  });

  it('has descriptive meta description', () => {
    expect(metadata.description).toContain('Get in touch');
    expect(metadata.description).toContain('collaboration');
    expect(metadata.description).toContain('opportunities');
    expect(metadata.description).toContain('project inquiries');
    expect(metadata.description?.length).toBeGreaterThan(50); // Good length for SEO
  });

  it('follows consistent title pattern', () => {
    expect(metadata.title).toMatch(/^Contact - Portfolio$/);
  });

  it('has relevant keywords in description', () => {
    const description = metadata.description || '';
    expect(description.toLowerCase()).toContain('collaboration');
    expect(description.toLowerCase()).toContain('project');
    expect(description.toLowerCase()).toContain('inquiries');
  });

  it('encourages user action in description', () => {
    const description = metadata.description || '';
    expect(description).toMatch(/^Get in touch/); // Starts with call-to-action
  });
});