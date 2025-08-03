# Design System & Visual Guidelines

## 🎨 Design Philosophy

### **Core Principles**
- **Minimalist Excellence**: Clean, purposeful design with strategic use of whitespace
- **Performance-First**: Every design decision considers loading speed and user experience
- **Accessibility-Driven**: WCAG 2.1 AA compliance built into every component
- **Mobile-First**: Responsive design that works beautifully on all devices
- **Animation-Enhanced**: Subtle, meaningful animations that guide user attention

### **Visual Hierarchy**
- **Primary Focus**: Hero section and featured projects
- **Secondary Focus**: Navigation and call-to-action elements
- **Supporting Elements**: Descriptive text and metadata
- **Background Elements**: Subtle textures and ambient animations

## 🎯 Brand Identity

### **Personality Traits**
- **Professional**: Trustworthy and competent
- **Creative**: Innovative and forward-thinking
- **Approachable**: Friendly and collaborative
- **Technical**: Detail-oriented and precise

### **Tone of Voice**
- **Confident but humble**: Showcase skills without arrogance
- **Clear and concise**: Technical concepts explained simply
- **Engaging**: Interactive and memorable experiences

## 🌈 Color System

### Theme Architecture
The portfolio uses a sophisticated dual-theme system with seamless transitions and context-aware color adaptation.

#### Light Theme
```scss
// Light Theme Variables
$light-theme: (
  // Primary Colors (Dark Green Accent)
  primary-50: #f0fdf4,
  primary-100: #dcfce7,
  primary-200: #bbf7d0,
  primary-300: #86efac,
  primary-400: #4ade80,
  primary-500: #16a34a,  // Main dark green brand color
  primary-600: #15803d,
  primary-700: #166534,
  primary-800: #14532d,
  primary-900: #0f2419,

  // Surface Colors
  surface-primary: #ffffff,
  surface-secondary: #f8fafc,
  surface-tertiary: #f1f5f9,
  surface-elevated: #ffffff,
  surface-overlay: rgba(255, 255, 255, 0.95),

  // Text Colors
  text-primary: #0f172a,
  text-secondary: #475569,
  text-tertiary: #64748b,
  text-inverse: #ffffff,
  text-accent: #16a34a,  // Dark green accent

  // Border Colors
  border-primary: #e2e8f0,
  border-secondary: #cbd5e1,
  border-focus: #16a34a,  // Dark green focus
  border-hover: #15803d,

  // Shadow Colors
  shadow-sm: rgba(0, 0, 0, 0.05),
  shadow-md: rgba(0, 0, 0, 0.1),
  shadow-lg: rgba(0, 0, 0, 0.15),
  shadow-xl: rgba(0, 0, 0, 0.2)
);
```

#### Dark Theme
```scss
// Dark Theme Variables
$dark-theme: (
  // Primary Colors (Dark Green Accent - adjusted for dark mode)
  primary-50: #0f2419,
  primary-100: #14532d,
  primary-200: #166534,
  primary-300: #15803d,
  primary-400: #16a34a,
  primary-500: #22c55e,  // Brighter green for dark mode visibility
  primary-600: #4ade80,
  primary-700: #86efac,
  primary-800: #bbf7d0,
  primary-900: #dcfce7,

  // Surface Colors
  surface-primary: #0f172a,
  surface-secondary: #1e293b,
  surface-tertiary: #334155,
  surface-elevated: #1e293b,
  surface-overlay: rgba(15, 23, 42, 0.95),

  // Text Colors
  text-primary: #f8fafc,
  text-secondary: #cbd5e1,
  text-tertiary: #94a3b8,
  text-inverse: #0f172a,
  text-accent: #22c55e,  // Bright green for dark mode

  // Border Colors
  border-primary: #334155,
  border-secondary: #475569,
  border-focus: #22c55e,  // Bright green focus
  border-hover: #16a34a,

  // Shadow Colors
  shadow-sm: rgba(0, 0, 0, 0.3),
  shadow-md: rgba(0, 0, 0, 0.4),
  shadow-lg: rgba(0, 0, 0, 0.5),
  shadow-xl: rgba(0, 0, 0, 0.6)
);

// Semantic Colors (theme-aware)
$success-light: #16a34a;  // Dark green for success
$success-dark: #22c55e;   // Brighter green for dark mode
$warning-light: #f59e0b;
$warning-dark: #fbbf24;
$error-light: #ef4444;
$error-dark: #f87171;
$info-light: #3b82f6;
$info-dark: #60a5fa;
```

#### Theme Implementation
```scss
// CSS Custom Properties for theme switching
:root {
  --theme-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="light"] {
  @each $key, $value in $light-theme {
    --color-#{$key}: #{$value};
  }
}

[data-theme="dark"] {
  @each $key, $value in $dark-theme {
    --color-#{$key}: #{$value};
  }
}

// Automatic theme detection
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    @each $key, $value in $dark-theme {
      --color-#{$key}: #{$value};
    }
  }
}
```

### **Background System**
```scss
// Light Theme (Primary)
$bg-primary: #ffffff;     // Main background
$bg-secondary: #f8fafc;   // Card backgrounds
$bg-tertiary: #f1f5f9;    // Subtle sections

// Dark Theme (Optional)
$bg-dark-primary: #0f172a;
$bg-dark-secondary: #1e293b;
$bg-dark-tertiary: #334155;
```

### **Usage Guidelines**
- **Primary colors**: Main content and navigation
- **Accent colors**: Interactive elements and highlights
- **Background colors**: Layered depth and visual separation
- **State colors**: Feedback and status indicators

## 📝 Typography System

### **Font Stack**
```scss
// Primary Font (Headings)
$font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

// Secondary Font (Body)
$font-secondary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

// Monospace Font (Code)
$font-mono: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
```

### **Type Scale**
```scss
// Heading Sizes
$text-6xl: 3.75rem;   // 60px - Hero titles
$text-5xl: 3rem;      // 48px - Page titles
$text-4xl: 2.25rem;   // 36px - Section titles
$text-3xl: 1.875rem;  // 30px - Subsection titles
$text-2xl: 1.5rem;    // 24px - Card titles
$text-xl: 1.25rem;    // 20px - Large text

// Body Sizes
$text-lg: 1.125rem;   // 18px - Large body text
$text-base: 1rem;     // 16px - Default body text
$text-sm: 0.875rem;   // 14px - Small text
$text-xs: 0.75rem;    // 12px - Captions, metadata
```

### **Font Weights**
```scss
$font-light: 300;     // Light text
$font-normal: 400;    // Body text
$font-medium: 500;    // Emphasized text
$font-semibold: 600;  // Subheadings
$font-bold: 700;      // Headings
$font-extrabold: 800; // Hero text
```

### **Line Heights**
```scss
$leading-tight: 1.25;    // Headings
$leading-snug: 1.375;    // Subheadings
$leading-normal: 1.5;    // Body text
$leading-relaxed: 1.625; // Large body text
$leading-loose: 2;       // Captions
```

## 📐 Spacing System

### **Spacing Scale**
```scss
// Base unit: 4px
$space-1: 0.25rem;   // 4px
$space-2: 0.5rem;    // 8px
$space-3: 0.75rem;   // 12px
$space-4: 1rem;      // 16px
$space-5: 1.25rem;   // 20px
$space-6: 1.5rem;    // 24px
$space-8: 2rem;      // 32px
$space-10: 2.5rem;   // 40px
$space-12: 3rem;     // 48px
$space-16: 4rem;     // 64px
$space-20: 5rem;     // 80px
$space-24: 6rem;     // 96px
$space-32: 8rem;     // 128px
```

### **Layout Spacing**
```scss
// Container Spacing
$container-padding: $space-6;    // Mobile
$container-padding-lg: $space-8; // Desktop

// Section Spacing
$section-spacing: $space-16;     // Between sections
$section-spacing-lg: $space-24;  // Large sections

// Component Spacing
$component-spacing: $space-8;    // Between components
$element-spacing: $space-4;      // Between elements
```

## 🎨 Unique Design Elements

### Signature Feature: "Code Constellation"
A dynamic, interactive background element that visualizes the developer's coding activity as a constellation of connected nodes, creating a unique visual identity that sets this portfolio apart.

#### Visual Concept
- **Nodes**: Represent repositories, with size indicating activity level
- **Connections**: Show technology relationships and project dependencies  
- **Animation**: Subtle floating motion with interactive hover effects
- **Responsiveness**: Adapts to screen size while maintaining visual impact

#### Implementation
```scss
.code-constellation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  opacity: 0.6;
  pointer-events: none;
  
  &__node {
    position: absolute;
    border-radius: 50%;
    background: var(--color-primary-500);
    box-shadow: 0 0 20px var(--color-primary-300);
    animation: float 6s ease-in-out infinite;
    
    &--large { width: 8px; height: 8px; }
    &--medium { width: 5px; height: 5px; }
    &--small { width: 3px; height: 3px; }
  }
  
  &__connection {
    position: absolute;
    height: 1px;
    background: linear-gradient(
      90deg, 
      transparent, 
      var(--color-primary-400), 
      transparent
    );
    opacity: 0.3;
    animation: pulse 4s ease-in-out infinite;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.4; }
}
```

### Interactive Elements

#### Morphing Navigation
Navigation that transforms based on scroll position and page context.

```scss
.nav-morph {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &--scrolled {
    backdrop-filter: blur(20px);
    background: var(--color-surface-overlay);
    border-bottom: 1px solid var(--color-border-primary);
    
    .nav-morph__logo {
      transform: scale(0.8);
    }
    
    .nav-morph__items {
      font-size: 0.9rem;
      letter-spacing: 0.02em;
    }
  }
}
```

#### Liquid Hover Effects
Smooth, organic hover animations that feel natural and engaging.

```scss
.liquid-hover {
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: var(--color-primary-500);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: -1;
    opacity: 0.1;
  }
  
  &:hover::before {
    width: 300px;
    height: 300px;
  }
}
```

### Theme Transition Effects

#### Smooth Theme Switching
```scss
* {
  transition: 
    background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-toggle {
  position: relative;
  width: 60px;
  height: 30px;
  background: var(--color-surface-tertiary);
  border-radius: 15px;
  border: 2px solid var(--color-border-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &__indicator {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 22px;
    height: 22px;
    background: var(--color-primary-500);
    border-radius: 50%;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &::before {
      content: '☀️';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 12px;
      transition: opacity 0.2s ease;
    }
  }
  
  &--dark &__indicator {
    transform: translateX(28px);
    
    &::before {
      content: '🌙';
    }
  }
}
```

### Micro-Interactions

#### Loading States
```scss
.loading-skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface-secondary) 25%,
    var(--color-surface-tertiary) 50%,
    var(--color-surface-secondary) 75%
  );
  background-size: 200% 100%;
  animation: loading-shimmer 1.5s infinite;
}

@keyframes loading-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

#### Success Animations
```scss
.success-checkmark {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-success);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 6px;
    left: 9px;
    width: 6px;
    height: 12px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    animation: checkmark-draw 0.3s ease-in-out;
  }
}

@keyframes checkmark-draw {
  0% {
    height: 0;
    width: 0;
  }
  50% {
    height: 0;
    width: 6px;
  }
  100% {
    height: 12px;
    width: 6px;
  }
}
```

### **Timing Functions**
```scss
// Easing Curves
$ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
$ease-out: cubic-bezier(0, 0, 0.2, 1);
$ease-in: cubic-bezier(0.4, 0, 1, 1);
$ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### **Duration Scale**
```scss
// Animation Durations
$duration-fast: 150ms;     // Quick interactions
$duration-normal: 300ms;   // Standard transitions
$duration-slow: 500ms;     // Complex animations
$duration-slower: 700ms;   // Page transitions
```

### **Animation Principles**
- **Subtle by default**: Animations enhance, don't distract
- **Purposeful motion**: Every animation has a clear purpose
- **Performance-conscious**: Use transform and opacity when possible
- **Reduced motion**: Respect user preferences

## 🧩 Component Library

### **Button System**
```scss
// Button Variants
.btn-primary {
  background: $accent-500;
  color: white;
  &:hover { background: $accent-600; }
}

.btn-secondary {
  background: transparent;
  color: $accent-500;
  border: 1px solid $accent-500;
  &:hover { background: $accent-500; color: white; }
}

.btn-ghost {
  background: transparent;
  color: $primary-800;
  &:hover { background: $bg-secondary; }
}
```

### **Card System**
```scss
// Card Variants
.card-default {
  background: $bg-primary;
  border: 1px solid $primary-700;
  border-radius: 12px;
  padding: $space-6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-elevated {
  @extend .card-default;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(0);
  transition: transform $duration-normal $ease-out;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
}
```

### **Navigation System**
```scss
// Navigation Styles
.nav-primary {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.nav-link {
  color: $primary-800;
  text-decoration: none;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: $accent-500;
    transition: width $duration-normal $ease-out;
  }
  
  &:hover::after,
  &.active::after {
    width: 100%;
  }
}
```

## 📱 Responsive Design System

### **Breakpoint System**
```scss
// Breakpoints
$breakpoint-sm: 640px;   // Small tablets
$breakpoint-md: 768px;   // Tablets
$breakpoint-lg: 1024px;  // Small desktops
$breakpoint-xl: 1280px;  // Large desktops
$breakpoint-2xl: 1536px; // Extra large screens

// Mixins
@mixin mobile-only {
  @media (max-width: #{$breakpoint-sm - 1px}) { @content; }
}

@mixin tablet-up {
  @media (min-width: $breakpoint-md) { @content; }
}

@mixin desktop-up {
  @media (min-width: $breakpoint-lg) { @content; }
}
```

### **Grid System**
```scss
// Container System
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $space-6;
  
  @include tablet-up {
    padding: 0 $space-8;
  }
}

// Grid System
.grid {
  display: grid;
  gap: $space-6;
  
  &.grid-2 {
    @include tablet-up {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  &.grid-3 {
    @include desktop-up {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
```

## 🎨 Visual Effects

### **Shadows**
```scss
// Shadow System
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
$shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);
```

### **Gradients**
```scss
// Gradient System
$gradient-primary: linear-gradient(135deg, $accent-500, $accent-600);
$gradient-subtle: linear-gradient(135deg, $bg-primary, $bg-secondary);
$gradient-overlay: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.6));
```

### **Borders & Radius**
```scss
// Border Radius
$radius-sm: 4px;
$radius-md: 8px;
$radius-lg: 12px;
$radius-xl: 16px;
$radius-full: 9999px;

// Border Widths
$border-thin: 1px;
$border-medium: 2px;
$border-thick: 4px;
```

## 🔧 Implementation Guidelines

### **CSS Architecture**
1. **Global styles**: Typography, reset, utilities
2. **Component styles**: Scoped CSS modules
3. **Layout styles**: Grid systems, containers
4. **Utility classes**: Spacing, colors, typography helpers

### **Naming Conventions**
- **BEM methodology**: Block__Element--Modifier
- **CSS Modules**: camelCase for class names
- **SCSS variables**: kebab-case with prefixes
- **Component files**: PascalCase matching React components

### **Performance Considerations**
- **Critical CSS**: Inline above-the-fold styles
- **CSS purging**: Remove unused styles in production
- **Efficient selectors**: Avoid deep nesting
- **CSS custom properties**: For dynamic theming

## 📋 Component Checklist

### **Every Component Should Have:**
- [ ] Responsive design across all breakpoints
- [ ] Accessible markup (ARIA labels, semantic HTML)
- [ ] Hover and focus states
- [ ] Loading and error states (where applicable)
- [ ] Dark mode support (future consideration)
- [ ] Animation/transition effects
- [ ] TypeScript props interface
- [ ] CSS Module styles
- [ ] Storybook documentation