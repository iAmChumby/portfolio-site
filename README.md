# Portfolio Site 

A modern, responsive portfolio website built with Next.js, TypeScript, and comprehensive testing.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14, TypeScript, Tailwind CSS
- **Comprehensive Testing**: Jest, React Testing Library with 90%+ coverage
- **Quality Assurance**: ESLint, Prettier, Husky pre-commit hooks
- **CI/CD Pipeline**: GitHub Actions for automated testing and deployment
- **Responsive Design**: Mobile-first approach with modern UI components

## 🛠️ Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/iAmChumby/portfolio-site.git
   cd portfolio-site
   ```

2. **Install dependencies**
   ```bash
   cd src-code
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   npm run test:coverage
   ```

## 📁 Project Structure

```
portfolio-site/
├── .github/workflows/     # CI/CD pipeline
├── docs/                  # Project documentation
├── sprints/              # Sprint planning and tracking
└── src-code/             # Main application code
    ├── src/
    │   ├── app/          # Next.js app directory
    │   ├── components/   # Reusable UI components
    │   ├── lib/          # Utility functions
    │   ├── styles/       # SCSS stylesheets
    │   └── types/        # TypeScript type definitions
    ├── public/           # Static assets
    └── tests/            # Test configuration
```

## 🧪 Testing

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: Full component interaction testing
- **Coverage**: 90%+ test coverage maintained
- **Pre-commit**: Automated testing on every commit

## 🔧 Development Workflow

1. Create feature branch from `main`
2. Make changes with tests
3. Pre-commit hooks run automatically
4. Push branch and create PR
5. CI pipeline runs tests
6. Merge after approval and passing tests

## 📊 Quality Metrics

- **Test Coverage**: 90.9% statements, 87.8% branches
- **Code Quality**: ESLint + Prettier enforced
- **Performance**: Lighthouse CI integration
- **Security**: Automated dependency scanning

---

Built with ❤️ following best practices for modern web development.
