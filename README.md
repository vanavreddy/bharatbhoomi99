# Bharat Bhoomi-99

A modern property rental platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Property Listings**: Browse and search rental properties across India
- **Property Details**: View detailed information, photos, and amenities
- **List Property**: Property owners can list their properties for free
- **Contact**: Get in touch with property owners or support
- **Authentication**: Sign in/Sign up with email or social providers
- **WCAG 2.2 Compliant**: Accessible to all users
- **SEO Optimized**: Built for search engine visibility
- **Mobile Responsive**: Works seamlessly on all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Form Validation**: Zod
- **Authentication**: NextAuth.js (planned)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bharatbhoomi99.git
   cd bharatbhoomi99
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy the environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (auth)/         # Authentication pages
│   ├── (main)/         # Main site pages
│   └── api/            # API routes
├── components/         # React components
│   ├── ui/             # Base UI components
│   ├── layout/         # Layout components
│   ├── sections/       # Page sections
│   └── property/       # Property-specific components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and constants
├── types/              # TypeScript type definitions
├── data/               # Mock data (for development)
└── styles/             # Global styles and theme
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking

## Brand Colors

- **Primary Blue**: #1B6B9C
- **Accent Coral**: #E84E35
- **Secondary Cyan**: #5ABED8

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

- Website: [bharatbhoomi99.com](https://bharatbhoomi99.com)
- Email: contact@bharatbhoomi99.com
