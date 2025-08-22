import { jest } from '@jest/globals';

// Mock Next.js fonts
jest.mock('next/font/google', () => ({
  Inter: () => ({
    variable: '--font-inter',
    className: 'font-inter',
  }),
  JetBrains_Mono: () => ({
    variable: '--font-jetbrains-mono',
    className: 'font-jetbrains-mono',
  }),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock Header component to avoid usePathname issues
jest.mock('@/components/layout/Header', () => {
  function MockHeader({ navigation, siteName }: {
    navigation?: Array<{ label: string; href: string; external?: boolean }>;
    siteName?: string;
  }) {
    return (
      <header data-testid="header">
        <div data-testid="site-name">{siteName}</div>
        <nav data-testid="navigation">
          {navigation?.map((item: { href: string; label: string }) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>
    );
  }
  MockHeader.displayName = 'MockHeader';
  return MockHeader;
});

// Mock SmoothScrollProvider
jest.mock('@/components/providers/SmoothScrollProvider', () => ({
  SmoothScrollProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock PageTransition component
jest.mock('@/components/ui/PageTransition', () => {
  function MockPageTransition({ children }: { children: React.ReactNode }) {
    return <div data-testid="page-transition">{children}</div>;
  }
  MockPageTransition.displayName = 'MockPageTransition';
  return MockPageTransition;
});

// Mock AnimatedBackground component
jest.mock('@/components/ui/AnimatedBackground', () => {
  function MockAnimatedBackground() {
    return <div data-testid="animated-background" />;
  }
  MockAnimatedBackground.displayName = 'MockAnimatedBackground';
  return MockAnimatedBackground;
});

// Mock Footer component
jest.mock('@/components/layout/Footer', () => {
  function MockFooter() {
    return <footer data-testid="footer">Footer Content</footer>;
  }
  MockFooter.displayName = 'MockFooter';
  return MockFooter;
});

// Mock lenis
jest.mock('lenis', () => {
  class MockLenis {
    options: Record<string, unknown>;
    isRunning: boolean;

    constructor(options = {}) {
      this.options = options;
      this.isRunning = false;
    }

    start() {
      this.isRunning = true;
    }

    stop() {
      this.isRunning = false;
    }

    destroy() {
      this.isRunning = false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    on(_event: string, _callback: () => void) {
      // Mock event listener
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    off(_event: string, _callback: () => void) {
      // Mock event listener removal
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    scrollTo(_target: string | number | HTMLElement, _options = {}) {
      // Mock scroll to functionality
    }
  }

  return MockLenis;
});