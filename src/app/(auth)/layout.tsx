import Link from 'next/link';
import { Logo, SkipLink } from '@/components/layout';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SkipLink />
      <div className="min-h-screen flex flex-col">
        {/* Simple Header */}
        <header className="py-4 px-6 border-b border-gray-100">
          <Logo />
        </header>

        {/* Main Content */}
        <main id="main-content" className="flex-1 flex items-center justify-center p-6 bg-gray-50">
          {children}
        </main>

        {/* Simple Footer */}
        <footer className="py-4 px-6 text-center text-sm text-gray-500 border-t border-gray-100">
          <p>
            &copy; {new Date().getFullYear()} Bharat Bhoomi-99. All rights reserved.
            {' '}&bull;{' '}
            <Link href="/privacy" className="hover:text-brand-primary">Privacy</Link>
            {' '}&bull;{' '}
            <Link href="/terms" className="hover:text-brand-primary">Terms</Link>
          </p>
        </footer>
      </div>
    </>
  );
}
