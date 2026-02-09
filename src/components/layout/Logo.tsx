import Link from 'next/link';
import Image from 'next/image';
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
      {/* Logo Image */}
      <div className="relative w-9 h-9 rounded-lg overflow-hidden">
        <Image
          src="/images/userinfo/primaryLogo.jpeg"
          alt="Bharat Bhoomi-99"
          width={36}
          height={36}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Logo Text */}
      {variant === 'default' && (
        <div className="flex flex-col">
          <span className="text-[17px] font-bold text-gray-900 leading-tight tracking-tight">
            Bharat Bhoomi
          </span>
          <span className="text-[11px] font-medium text-brand-primary tracking-wide">
            Family Realtor
          </span>
        </div>
      )}
    </Link>
  );
}
