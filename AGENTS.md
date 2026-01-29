# AGENTS.md

This document provides essential context, coding standards, architecture patterns, and best practices for AI agents working on this portfolio site codebase.

## 1. Project Overview

This is a modern, high-performance portfolio website built with **Next.js 16**, **React 19**, and **Tailwind CSS**. The site showcases projects, shares "now" updates, and provides a secure contact channel.

### Key Features

- **"Now" Page**: A dedicated section to share what I'm currently working on, playing, and listening to (inspired by [Derek Sivers](https://nownownow.com/about))
- **Project Showcase**: Interactive gallery of technical projects with detailed descriptions
- **Secure Contact Form**: 
  - Protected by **Cloudflare Turnstile** captcha
  - Rate limiting via **Vercel KV (Redis)**
  - Emails sent via **Nodemailer** (Ionos SMTP)
  - Form submissions automatically logged to **Google Sheets**
- **Modern UI/UX**: Framer Motion animations, Tailwind CSS, responsive design

### Target Audience

- Potential employers and clients
- Fellow developers and collaborators
- Industry professionals and recruiters

## 2. Tech Stack & Architecture

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5+
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 3.4.17
- **Animations**: Framer Motion 12.23.12
- **Smooth Scroll**: Lenis 1.3.8

### Backend Services

- **Vercel KV (Redis)**: Rate limiting and session management
- **Google Sheets API**: Form submission archiving
- **Nodemailer**: SMTP email delivery (Ionos)
- **Cloudflare Turnstile**: Bot protection

### Testing

- **Jest** 30.0.5
- **React Testing Library**
- **Test Environment**: jsdom

### Development Tools

- **ESLint** 9 + **Prettier** 3.6.2
- **Husky** 9.1.7 (Git hooks)
- **Lighthouse CI** (Performance monitoring)

### Deployment

- **Platform**: Vercel

## 3. Project Structure

```
portfolio-site/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API route handlers
│   │   ├── about/             # About page
│   │   ├── contact/           # Contact page
│   │   ├── projects/          # Projects page
│   │   ├── now/               # Now page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── sections/         # Page sections
│   │   └── layout/           # Layout components
│   ├── lib/                  # Utilities and helpers
│   ├── data/                 # JSON content files
│   └── types/                # TypeScript definitions
├── public/                   # Static assets
├── docs/                     # Project documentation
└── tests/                    # Test files
```

### Key Directories

- **`src/app/`**: Next.js App Router pages and API routes
- **`src/components/ui/`**: Reusable UI primitives (Button, Card, etc.)
- **`src/components/sections/`**: Page sections (Hero, About, Projects, etc.)
- **`src/components/layout/`**: Layout components (Header, Footer)
- **`src/lib/`**: Utility functions, API clients, helpers
- **`src/data/`**: JSON content files (projects.json, now.json, site-config.json)
- **`src/types/`**: TypeScript type definitions
- **`public/`**: Static assets (images, icons, documents)

## 4. Coding Standards

### TypeScript Configuration

- **Strict mode**: Enabled
- **Path aliases**: `@/*` maps to `./src/*`
- **Target**: ES2017
- **Module resolution**: bundler

**Always use path aliases for imports:**
```typescript
// ✅ GOOD
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

// ❌ BAD
import { Button } from '../../../components/ui/Button';
```

### Code Style (Prettier)

- **Quotes**: Single quotes
- **Semicolons**: Required
- **Indentation**: 2 spaces
- **Print width**: 80 characters
- **Trailing commas**: ES5 style
- **Arrow parens**: Avoid when possible

### Component Patterns

**Functional Components:**
- Always use functional components with TypeScript interfaces
- Use `forwardRef` for components that need ref forwarding
- Export both component and types separately

**Example:**
```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn('btn', `btn-${variant}`, `btn-${size}`, className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
```

**Accessibility:**
- Use semantic HTML elements
- Include ARIA labels where appropriate
- Ensure keyboard navigation works
- Maintain proper focus management

### File Naming Conventions

- **Components**: PascalCase (e.g., `Button.tsx`, `ContactForm.tsx`)
- **Utilities**: camelCase (e.g., `utils.ts`, `validation.ts`)
- **Types**: camelCase (e.g., `contact.ts`, `content.ts`)
- **Pages**: `page.tsx` (Next.js convention)
- **API Routes**: `route.ts` (Next.js convention)

## 5. Common Patterns & Utilities

### Class Name Merging

Always use the `cn()` utility from `@/lib/utils` for conditional classes:

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  variant === 'primary' && 'primary-class',
  className
)} />
```

### Component Props

- Always extend appropriate HTML element props
- Use TypeScript interfaces (not types) for component props
- Include proper default values
- Use discriminated unions for variant props

**Example:**
```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}
```

### Path Aliases

Always use `@/` prefix for imports from `src/`:

```typescript
// ✅ GOOD
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import type { Project } from '@/types/content';

// ❌ BAD
import { Button } from '../../components/ui/Button';
```

## 6. Testing Requirements

### Test Setup

- **Framework**: Jest with React Testing Library
- **Environment**: jsdom
- **Coverage**: Collected from `src/**/*.{js,jsx,ts,tsx}`
- **Setup file**: `jest.setup.js`
- **Path mapping**: `@/*` mapped to `./src/*`

### Testing Guidelines

- Write tests for new components and features
- Test user interactions, not implementation details
- Use `@testing-library/user-event` for user interactions
- Test accessibility where applicable
- Run `npm test` before completing work

**Example Test:**
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Check test coverage
npm run test:coverage
```

## 7. Environment Variables & Secrets

### Critical Security Rules

- **NEVER commit secrets or API keys** to version control
- All sensitive values must be in `.env.local` (gitignored)
- Reference `.env.example` for required variables
- Use environment variable validation via `src/lib/env.ts`

### Required Environment Variables

**Contact Form (Nodemailer/Ionos SMTP):**
- `CONTACT_NOTIFICATION_EMAIL`
- `CONTACT_SENDER_EMAIL`
- `CONTACT_SENDER_PASSWORD`
- `SMTP_HOST`
- `SMTP_PORT`

**Vercel KV (Redis):**
- `LUKE_KV_KV_REST_API_READ_ONLY_TOKEN`
- `LUKE_KV_KV_REST_API_TOKEN`
- `LUKE_KV_KV_REST_API_URL`
- `LUKE_KV_KV_REST_API_URL`
- `LUKE_KV_REDIS_URL`

**Cloudflare Turnstile:**
- `NEXT_PUBLIC_TURNSTILE_KEY` (client-side)
- `TURNSTILE_SECRET_KEY` (server-side)

**Google Sheets API:**
- `SHEETS_JSON_PRIVATE_KEY`
- `SHEETS_SERVICE_ACCOUNT_EMAIL`

**Vercel System:**
- `VERCEL_OIDC_TOKEN`

### Environment Variable Access

**Server-side:**
```typescript
const apiKey = process.env.SECRET_KEY;
```

**Client-side:**
Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser:
```typescript
const publicKey = process.env.NEXT_PUBLIC_TURNSTILE_KEY;
```

## 8. Content Management

### File-based Content System

The site uses a file-based content management system with JSON files:

- **Projects**: `src/data/projects.json`
- **Now page content**: `src/data/now.json`
- **Site configuration**: `src/data/site-config.json`
- **Content loader**: `src/lib/content-loader.ts`

### Content Updates

- Modify JSON files directly for content changes
- Use TypeScript types from `src/types/content.ts` for type safety
- Validate content structure matches expected types
- Content is loaded at build time and runtime

**Example:**
```typescript
import { loadProjects } from '@/lib/content-loader';
import type { Project } from '@/types/content';

const projects: Project[] = await loadProjects();
```

## 9. API Routes

### Location

API routes are located in `src/app/api/` using Next.js App Router conventions.

### Existing Endpoints

- Contact form submission endpoint
- Health check endpoint
- GitHub integration endpoints

### API Route Patterns

**Structure:**
```typescript
// src/app/api/endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Validate input
    const body = await request.json();
    
    // Rate limiting (if needed)
    // Business logic
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Best Practices:**
- Use Next.js 13+ App Router API route handlers
- Implement proper error handling and status codes
- Add rate limiting via Vercel KV when needed
- Validate inputs using `src/lib/validation.ts`
- Never expose sensitive data in error messages
- Use appropriate HTTP methods (GET, POST, etc.)

## 10. Styling Guidelines

### Tailwind CSS

- Use utility classes primarily
- Custom classes defined in `src/app/globals.css`
- Responsive design: mobile-first approach
- Use `cn()` utility for conditional classes

**Responsive Breakpoints:**
- Mobile-first approach
- Use Tailwind's responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

**Example:**
```typescript
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Content */}
</div>
```

### Animations

**Framer Motion:**
- Use for complex animations and page transitions
- Prefer `motion` components for animated elements

**CSS Transitions:**
- Use for simple hover/focus states
- Prefer CSS over JavaScript when possible

**Smooth Scrolling:**
- Implemented via Lenis library
- Configured in `src/components/providers/SmoothScrollProvider.tsx`

## 11. Performance Considerations

### Optimization Requirements

- **Image optimization**: Always use Next.js `Image` component
- **Code splitting**: Automatic with Next.js App Router
- **Lighthouse CI**: Performance monitoring integrated
- **Avoid unnecessary re-renders**: Use `React.memo` when appropriate
- **Bundle size**: Monitor and optimize dependencies

**Image Example:**
```typescript
import Image from 'next/image';

<Image
  src="/images/project.png"
  alt="Project screenshot"
  width={800}
  height={600}
  priority={false} // Only for above-the-fold images
/>
```

### Performance Checklist

- [ ] Images use Next.js Image component
- [ ] No unnecessary re-renders
- [ ] Code splitting implemented where appropriate
- [ ] Lighthouse scores meet thresholds
- [ ] Bundle size is optimized

## 12. Git Workflow

### Pre-commit Hooks

- **Husky** runs lint-staged automatically
- **ESLint** and **Prettier** run on staged files
- Tests should pass before committing

### Branch Strategy

- Follow existing branch naming conventions
- Never commit directly to main without explicit permission
- Create feature branches for new work
- Use descriptive commit messages

### Commit Message Format

Follow conventional commit format:
```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Maintenance tasks

## 13. Common Tasks & Patterns

### Adding a New Component

1. Create component file in appropriate directory:
   - `src/components/ui/` for reusable UI primitives
   - `src/components/sections/` for page sections
   - `src/components/layout/` for layout components

2. Define TypeScript interface for props
3. Implement component with proper accessibility
4. Export component and types:
   ```typescript
   export { Component };
   export type { ComponentProps };
   ```
5. Add to `index.ts` barrel export if applicable
6. Write tests in corresponding test file
7. Update documentation if needed

### Adding a New Page

1. Create `page.tsx` in `src/app/[route]/`
2. Use Next.js metadata API for SEO:
   ```typescript
   export const metadata = {
     title: 'Page Title',
     description: 'Page description',
   };
   ```
3. Follow existing page structure patterns
4. Ensure responsive design
5. Add to navigation if needed

### Adding a New API Route

1. Create `route.ts` in `src/app/api/[endpoint]/`
2. Implement proper error handling
3. Add rate limiting if needed (use Vercel KV)
4. Validate inputs using `src/lib/validation.ts`
5. Return appropriate HTTP status codes
6. Document the endpoint if it's public-facing

### Adding a New Utility Function

1. Create or add to appropriate file in `src/lib/`
2. Export function with JSDoc comments
3. Add TypeScript types
4. Write tests if applicable
5. Use in components/API routes

## 14. Important Notes

### Things to Remember

- Always run `npm run type-check` before completing TypeScript changes
- Ensure all tests pass: `npm test`
- Check linting: `npm run lint`
- Format code: Prettier runs automatically via Husky
- Check Lighthouse scores for performance regressions
- Maintain accessibility standards (WCAG compliance)

### Areas Requiring Extra Care

**Contact Form:**
- Rate limiting implementation
- Input validation
- Security (Turnstile captcha)
- Error handling

**API Routes:**
- Authentication/authorization
- Rate limiting
- Error handling
- Input validation

**Environment Variables:**
- Never expose secrets
- Use proper server/client separation
- Validate required variables

**Image Optimization:**
- Always use Next.js Image component
- Provide proper alt text
- Set appropriate dimensions

**Type Safety:**
- Strict TypeScript mode is enabled
- Ensure all types are properly defined
- Avoid `any` types

## 15. Resources & Documentation

### Key Documentation Files

- **`README.md`**: Project overview and setup instructions
- **`docs/README.md`**: Documentation index
- **`docs/design-system.md`**: Design guidelines and component patterns
- **`docs/technical-requirements.md`**: Technical specifications
- **`docs/architecture-decisions.md`**: Architecture decisions and rationale
- **`docs/active/architecture/current-state.md`**: Current implementation state

### External Resources

- [Next.js 16 App Router Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Testing Library](https://testing-library.com/react)

### Getting Help

When working on this codebase:

1. **Check existing code**: Look for similar patterns in the codebase
2. **Review documentation**: Check `docs/` directory for relevant information
3. **Follow conventions**: Match existing code style and patterns
4. **Test thoroughly**: Ensure changes work and don't break existing functionality
5. **Ask questions**: If something is unclear, ask rather than guess

---

**Last Updated**: January 2026
