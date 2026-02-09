import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PAGE_TITLES, PAGE_DESCRIPTIONS } from '@/lib/constants/seo';
import SignUpClient from './SignUpClient';

export const metadata: Metadata = {
  title: PAGE_TITLES.signUp,
  description: PAGE_DESCRIPTIONS.signUp,
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpClient />
    </Suspense>
  );
}
