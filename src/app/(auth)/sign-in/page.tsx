import type { Metadata } from 'next';
import { PAGE_TITLES, PAGE_DESCRIPTIONS } from '@/lib/constants/seo';
import SignInClient from './SignInClient';

export const metadata: Metadata = {
  title: PAGE_TITLES.signIn,
  description: PAGE_DESCRIPTIONS.signIn,
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignInPage() {
  return <SignInClient />;
}
