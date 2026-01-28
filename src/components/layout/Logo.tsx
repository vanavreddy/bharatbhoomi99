import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export function Logo({ className, variant = 'default' }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn('flex items-center gap-2.5 group', className)}
      aria-label="Bharat Bhoomi-99 - Home"
    >
      {/* Logo Icon */}
      <div className="relative flex items-center justify-center w-9 h-9 bg-brand-primary rounded-lg">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-5 h-5 text-white"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>

      {/* Logo Text */}
      {variant === 'default' && (
        <div className="flex flex-col">
          <span className="text-[17px] font-bold text-gray-900 leading-tight tracking-tight">
            Bharat Bhoomi
          </span>
          <span className="text-[11px] font-medium text-brand-primary tracking-wide">
            Find Your Home
          </span>
        </div>
      )}
    </Link>
  );
}
