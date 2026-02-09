import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout';
import { Card } from '@/components/ui';
import { JsonLd } from '@/components/seo';
import { getFaqSchema } from '@/lib/seo';
import { ROUTES } from '@/lib/constants';
import { SITE_CONFIG } from '@/lib/constants/seo';
import { Phone, Mail, MessageSquare, Building2, Search, FileText, HelpCircle } from 'lucide-react';

const helpDescription = 'Get help with using Bharat Bhoomi-99. Find answers to common questions about property listings, account management, and more.';

export const metadata: Metadata = {
  title: 'Help Center',
  description: helpDescription,
  alternates: {
    canonical: `${SITE_CONFIG.url}/help`,
  },
  openGraph: {
    title: `Help Center | ${SITE_CONFIG.name}`,
    description: helpDescription,
    url: `${SITE_CONFIG.url}/help`,
    images: [{ url: SITE_CONFIG.ogImage, alt: SITE_CONFIG.name }],
  },
};

const faqs = [
  {
    question: 'How do I list my property?',
    answer: 'Click on "Post Property" in the navigation bar. Fill in property details including type, location, price, and photos. Your listing will be live once submitted.',
  },
  {
    question: 'How do I contact a property owner?',
    answer: 'Sign in to your account and visit any property listing. You can call or message the owner directly from the property detail page.',
  },
  {
    question: 'Is it free to list a property?',
    answer: 'Yes, listing your property on Bharat Bhoomi-99 is completely free. There are no hidden charges.',
  },
  {
    question: 'How do I create an account?',
    answer: 'Click "Sign Up" and register using your phone number or email. You can also continue as a guest with limited access.',
  },
  {
    question: 'How are properties verified?',
    answer: 'Our team verifies property listings by confirming owner details and property information. Verified listings display a green checkmark badge.',
  },
  {
    question: 'Which areas do you cover?',
    answer: 'We primarily cover Bangalore and surrounding areas including Chandapura, Dommasandra, Electronic City, Kommasandra, and more.',
  },
];

const helpCategories = [
  { icon: Search, title: 'Finding Properties', description: 'Search, filter, and browse listings' },
  { icon: Building2, title: 'Listing Properties', description: 'Post and manage your property' },
  { icon: FileText, title: 'Account & Billing', description: 'Sign up, login, and profile' },
  { icon: MessageSquare, title: 'Contact & Support', description: 'Get in touch with our team' },
];

export default function HelpPage() {
  return (
    <div className="py-8 md:py-12">
      <JsonLd data={getFaqSchema(faqs)} />
      <Container>
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
            <HelpCircle className="h-8 w-8 text-brand-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
            Help Center
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions or reach out to our support team.
          </p>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {helpCategories.map((cat) => (
            <Card key={cat.title} padding="md" className="text-center hover:border-brand-primary transition-colors">
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                <cat.icon className="h-5 w-5 text-brand-primary" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{cat.title}</h3>
              <p className="text-xs text-gray-500">{cat.description}</p>
            </Card>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.question} padding="lg">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gray-50 rounded-2xl p-8 text-center max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Still need help?</h2>
          <p className="text-gray-600 mb-6">Our team is available Mon-Sat, 9AM to 6PM.</p>
          <div className="flex flex-row items-center justify-center gap-6 text-sm">
            <a href="tel:+919448514449" className="flex items-center gap-2 text-gray-600 hover:text-brand-primary transition-colors">
              <Phone className="h-4 w-4" />
              +91 94485 14449
            </a>
            <a href="mailto:contact@bharatbhoomi99.com" className="flex items-center gap-2 text-gray-600 hover:text-brand-primary transition-colors">
              <Mail className="h-4 w-4" />
              Email Us
            </a>
            <Link href={ROUTES.CONTACT} className="flex items-center gap-2 text-brand-primary font-medium hover:text-brand-primary-dark transition-colors">
              <MessageSquare className="h-4 w-4" />
              Contact Form
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
