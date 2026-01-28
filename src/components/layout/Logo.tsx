import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Building2 } from 'lucide-react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: { icon: 'h-6 w-6', text: 'text-lg' },
  md: { icon: 'h-8 w-8', text: 'text-xl' },
  lg: { icon: 'h-10 w-10', text: 'text-2xl' },
};

export function Logo({ className, showText = true, size = 'md' }: LogoProps) {
  const sizeClasses = sizes[size];

  return (
    <Link
      href="/"
      className={cn('flex items-center gap-2 group', className)}
      aria-label="Bharat Bhoomi-99 - Home"
    >
      <div className="relative">
        <Building2
          className={cn(
            sizeClasses.icon,
            'text-brand-primary transition-transform group-hover:scale-105'
          )}
          strokeWidth={1.5}
        />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              sizeClasses.text,
              'font-heading font-bold text-brand-accent tracking-tight'
            )}
          >
            Bharat Bhoomi-99
          </span>
          <span className="text-[10px] text-brand-secondary font-medium tracking-widest uppercase">
            Real Estate | Builders
          </span>
        </div>
      )}
    </Link>
  );
}
