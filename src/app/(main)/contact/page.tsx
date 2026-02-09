import type { Metadata } from 'next';
import { Container } from '@/components/layout';
import { Button, Input, TextArea, Card } from '@/components/ui';
import { JsonLd } from '@/components/seo';
import { getLocalBusinessSchema } from '@/lib/seo';
import { PAGE_TITLES, PAGE_DESCRIPTIONS, SITE_CONFIG } from '@/lib/constants/seo';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Headphones, Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: PAGE_TITLES.contact,
  description: PAGE_DESCRIPTIONS.contact,
  alternates: {
    canonical: `${SITE_CONFIG.url}/contact`,
  },
  openGraph: {
    title: `${PAGE_TITLES.contact} | ${SITE_CONFIG.name}`,
    description: PAGE_DESCRIPTIONS.contact,
    url: `${SITE_CONFIG.url}/contact`,
    images: [{ url: SITE_CONFIG.ogImage, alt: SITE_CONFIG.name }],
  },
};

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@bharatbhoomi99.com',
    href: 'mailto:contact@bharatbhoomi99.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 94485 14449',
    href: 'tel:+919448514449',
  },
  {
    icon: Phone,
    label: 'Alternate Phone',
    value: '+91 99001 51820',
    href: 'tel:+919900151820',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: 'No.99/1, Chandapura Dommasandra Road, Sri Bayalu Basaveshwara Swamy Temple, Kommasandra, Bengaluru - 562125',
    href: null,
  },
  {
    icon: Clock,
    label: 'Working Hours',
    value: 'Mon - Sat: 9:00 AM - 6:00 PM',
    href: null,
  },
];

const supportOptions = [
  {
    icon: MessageSquare,
    title: 'General Inquiry',
    description: 'Questions about our services or platform',
  },
  {
    icon: Building2,
    title: 'Property Listing',
    description: 'Help with listing your property',
  },
  {
    icon: Headphones,
    title: 'Technical Support',
    description: 'Issues with website or app',
  },
];

export default function ContactPage() {
  return (
    <div className="py-8">
      <JsonLd data={getLocalBusinessSchema()} />
      <Container>
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have a question or need assistance? We&apos;re here to help.
            Fill out the form below or reach out through any of our contact channels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    name="name"
                    placeholder="Your name"
                    required
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  hint="Optional, but helps us reach you faster"
                />
                <Input
                  label="Subject"
                  name="subject"
                  placeholder="What is your inquiry about?"
                  required
                />
                <TextArea
                  label="Message"
                  name="message"
                  placeholder="Tell us how we can help you..."
                  required
                  maxLength={1000}
                  showCount
                />
                <Button type="submit" size="lg" leftIcon={<Send className="h-5 w-5" />}>
                  Send Message
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="p-2 bg-brand-primary/10 rounded-lg shrink-0">
                      <item.icon className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{item.label}</div>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="font-medium text-gray-900 hover:text-brand-primary"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div className="font-medium text-gray-900">{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Support Options */}
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">How can we help?</h2>
              <div className="space-y-3">
                {supportOptions.map((option) => (
                  <div
                    key={option.title}
                    className="p-3 rounded-lg border border-gray-200 hover:border-brand-primary hover:bg-brand-primary/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <option.icon className="h-5 w-5 text-brand-primary" />
                      <div>
                        <div className="font-medium text-gray-900">{option.title}</div>
                        <div className="text-sm text-gray-500">{option.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Map Placeholder */}
            <Card padding="none" className="overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Kommasandra, Bengaluru</p>
                  <p className="text-xs">562125</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
