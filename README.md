# Portfolio Site

A modern, high-performance portfolio website built with **Next.js 16**, **React 19**, and **Tailwind CSS**. Designed to showcase projects, share "now" updates, and provide a secure contact channel.

## 🚀 Features

- **"Now" Page**: A dedicated section to share what I'm currently working on, playing, and listening to (inspired by [Derek Sivers](https://nownownow.com/about)).
- **Project Showcase**: Interactive gallery of technical projects with detailed descriptions.
- **Secure Contact Form**: 
  - Protected by **Cloudflare Turnstile** captcha.
  - Rate limiting via **Vercel KV (Redis)**.
  - Emails sent via **Nodemailer** (Ionos SMTP).
  - Form submissions automatically logged to **Google Sheets**.
- **Modern UI/UX**:
  - **Framer Motion** for smooth animations and page transitions.
  - **Tailwind CSS** for responsive, mobile-first design.
  - **Geist** font optimizations.
- **Performance & Quality**:
  - **Lighthouse CI** integration for performance monitoring.
  - Comprehensive testing with **Jest** and **React Testing Library**.
  - **Husky** pre-commit hooks for code quality.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion, Animated Backgrounds
- **Backend/Services**:
  - **Vercel KV (Redis)**: Rate limiting and session management.
  - **Google Sheets API**: Form submission archiving.
  - **Nodemailer**: SMTP email delivery.
  - **Cloudflare Turnstile**: Bot protection.
- **Deployment**: Vercel

## ⚡ Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- A Vercel account (recommended) using `vercel link`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/iAmChumby/portfolio-site.git
   cd portfolio-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required sensitive credentials (API keys, SMTP settings, etc.).

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🧪 Testing

The project maintains high test coverage using Jest and React Testing Library.

```bash
# Run unit & integration tests
npm test

# Check test coverage
npm run test:coverage
```

## 📁 Project Structure

```
portfolio-site/
├── .github/workflows/     # CI/CD pipeline
├── docs/                  # Project documentation
├── src/
│   ├── app/               # Next.js App Router pages (about, contact, projects, now)
│   ├── components/        # Reusable UI components
│   │   ├── sections/      # Main page sections (Hero, About, Now, etc.)
│   │   └── ui/            # Primitive UI elements
│   ├── lib/               # Utilities (API clients, helpers)
│   └── styles/            # Global styles
├── public/                # Static assets
└── tests/                 # Test configuration
```

## 📄 License

This project is licensed under the MIT License.
