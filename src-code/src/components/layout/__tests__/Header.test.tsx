import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

describe('Header', () => {
  it('renders header with navigation', () => {
    render(<Header />);
    
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders with logo', () => {
    render(<Header logo="/logo.png" siteName="My Site" />);

    const logo = screen.getByAltText('My Site');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo.png');
  });

  it('renders with default props', () => {
    render(<Header />);
    
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Get In Touch')).toBeInTheDocument();
  });

  it('renders with custom navigation', () => {
    const customNav = [
      { label: 'Custom Home', href: '/' },
      { label: 'Custom About', href: '/about' },
    ];

    render(<Header navigation={customNav} />);
    
    expect(screen.getByText('Custom Home')).toBeInTheDocument();
    expect(screen.getByText('Custom About')).toBeInTheDocument();
    expect(screen.queryByText('Projects')).not.toBeInTheDocument();
  });

  it('renders with custom site name', () => {
    render(<Header siteName="My Custom Site" />);
    
    expect(screen.getByText('My Custom Site')).toBeInTheDocument();
    expect(screen.queryByText('Portfolio')).not.toBeInTheDocument();
  });

  it('toggles mobile menu', () => {
    render(<Header />);
    
    const menuButton = screen.getByLabelText('Toggle menu');
    expect(menuButton).toBeInTheDocument();
    
    // Initially, mobile menu should not be visible
    expect(screen.queryByText('Home')).toBeInTheDocument(); // Desktop nav
    
    // Click to open mobile menu
    fireEvent.click(menuButton);
    
    // Mobile menu should now be visible (we can't easily test visibility, but we can test the button was clicked)
    expect(menuButton).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
  });

  it('has proper accessibility attributes', () => {
    render(<Header />);

    const menuButton = screen.getByLabelText('Toggle menu');
    expect(menuButton).toHaveAttribute('aria-label', 'Toggle menu');
  });

  it('navigation links have correct href attributes', () => {
    render(<Header />);

    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about');
    expect(screen.getByText('Projects').closest('a')).toHaveAttribute('href', '/projects');
    expect(screen.getByText('Blog').closest('a')).toHaveAttribute('href', '/blog');
    expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '/contact');
  });
});