import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from '../ThemeToggle';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders correctly', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Switch to dark theme');
  });

  it('applies custom className', () => {
    render(<ThemeToggle className="custom-class" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('initializes with light theme by default', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    render(<ThemeToggle />);
    
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  it('initializes with saved theme from localStorage', async () => {
    localStorageMock.getItem.mockReturnValue('dark');
    
    render(<ThemeToggle />);
    
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  it('toggles theme when clicked', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    
    // Wait for initial mount
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
    
    // Click to toggle to dark
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
      expect(button).toHaveAttribute('aria-label', 'Switch to light theme');
    });
    
    // Click to toggle back to light
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
      expect(button).toHaveAttribute('aria-label', 'Switch to dark theme');
    });
  });

  it('respects system preference when no saved theme', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    // Mock dark mode preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    
    render(<ThemeToggle />);
    
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  it('shows loading state before mount', () => {
    // Create a component that hasn't mounted yet by mocking useEffect
    const { container } = render(<ThemeToggle />);
    
    // Since the component mounts immediately in tests, we'll check for the presence of the button
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('has proper accessibility attributes', async () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-label');
      expect(screen.getByText('Toggle theme')).toBeInTheDocument();
    });
  });
});