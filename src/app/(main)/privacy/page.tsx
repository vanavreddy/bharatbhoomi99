import type { Metadata } from 'next';
import { Container } from '@/components/layout';
import { SITE_CONFIG } from '@/lib/constants/seo';

const privacyDescription = 'Privacy Policy for Bharat Bhoomi-99. Learn how we collect, use, and protect your personal information in compliance with Indian data protection laws.';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: privacyDescription,
  alternates: {
    canonical: `${SITE_CONFIG.url}/privacy`,
  },
  openGraph: {
    title: `Privacy Policy | ${SITE_CONFIG.name}`,
    description: privacyDescription,
    url: `${SITE_CONFIG.url}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <div className="py-8 md:py-12">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Effective Date: 1 February 2026 &nbsp;|&nbsp; Last Updated: 9 February 2026
          </p>

          <div className="space-y-10 text-gray-600 leading-relaxed">
            {/* Introduction */}
            <section>
              <p>
                Bharat Bhoomi-99 (&quot;we&quot;, &quot;us&quot;, or &quot;the Platform&quot;), operated by Madhu Chandra,
                is a property listing and real estate intermediary platform accessible at{' '}
                <span className="text-brand-primary">bharatbhoomi99.com</span>. This Privacy Policy
                explains how we collect, use, store, disclose, and protect your personal data in
                compliance with the Digital Personal Data Protection Act, 2023 (&quot;DPDPA&quot;), the
                Information Technology Act, 2000 (&quot;IT Act&quot;), and the Information Technology
                (Reasonable Security Practices and Procedures and Sensitive Personal Data or
                Information) Rules, 2011 (&quot;SPDI Rules&quot;).
              </p>
              <p className="mt-3">
                By using the Platform, you (&quot;User&quot; or &quot;Data Principal&quot;) consent to the practices
                described in this Privacy Policy. If you do not agree, please discontinue use of the Platform.
              </p>
            </section>

            {/* 1. Information We Collect */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>

              <h3 className="font-medium text-gray-800 mt-4 mb-2">1.1 Personal Data Provided by You</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Full name, email address, and mobile phone number during account registration</li>
                <li>Property details (address, type, price, photos, amenities) when you create a listing</li>
                <li>Inquiry details when you contact a property owner through the Platform</li>
                <li>Messages or communications sent through the Platform</li>
              </ul>

              <h3 className="font-medium text-gray-800 mt-4 mb-2">1.2 Data Collected Automatically</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>IP address, browser type, operating system, and device identifiers</li>
                <li>Pages viewed, search queries, property views, and interaction timestamps</li>
                <li>Approximate geolocation derived from IP address</li>
                <li>Referral URLs and exit pages</li>
              </ul>

              <h3 className="font-medium text-gray-800 mt-4 mb-2">1.3 Cookies &amp; Local Storage</h3>
              <p>
                We use cookies and browser local storage to maintain your login session, store user
                preferences, and track property view activity. You may disable cookies in your browser
                settings; however, certain features such as login persistence may not function correctly.
              </p>
            </section>

            {/* 2. Purpose of Data Collection */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Purpose of Data Collection</h2>
              <p>We collect and process your personal data for the following specific purposes:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
                <li><strong>Account Management:</strong> To create and manage your user account, verify your identity via OTP or email, and maintain session security</li>
                <li><strong>Service Delivery:</strong> To display property listings, facilitate contact between property owners and prospective buyers, and process property inquiries</li>
                <li><strong>Communication:</strong> To send property recommendations, service updates, and respond to support requests</li>
                <li><strong>Platform Improvement:</strong> To analyse usage patterns, improve search relevance, and enhance user experience</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal proceedings</li>
                <li><strong>Security &amp; Fraud Prevention:</strong> To detect, prevent, and address fraud, unauthorized access, and platform misuse</li>
              </ul>
              <p className="mt-3">
                We do not process personal data for any purpose beyond what is stated here without
                obtaining your separate, specific consent.
              </p>
            </section>

            {/* 3. Consent */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Consent</h2>
              <p>
                By registering on the Platform or submitting your personal data, you provide free,
                specific, informed, unconditional, and unambiguous consent to the collection and
                processing of your data as described in this Policy, in accordance with Section 6
                of the DPDPA, 2023.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-3 ml-2">
                <li>You may withdraw consent at any time by contacting us (see Section 10 below). Upon withdrawal, we will cease processing your data, subject to any legal obligation to retain it.</li>
                <li>Withdrawal of consent does not affect the lawfulness of processing carried out before withdrawal.</li>
                <li>If consent is withdrawn, certain features of the Platform may become unavailable.</li>
              </ul>
            </section>

            {/* 4. Data Sharing & Disclosure */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Sharing &amp; Disclosure</h2>
              <p><strong>We do not sell your personal data to third parties.</strong></p>
              <p className="mt-2">We may share your data in the following limited circumstances:</p>
              <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
                <li><strong>Property Owners / Seekers:</strong> Your name and contact details may be shared with a property owner or seeker only when you initiate contact through the Platform (e.g., clicking &quot;Call Owner&quot; or &quot;Send Message&quot;).</li>
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in hosting, analytics, or communication services, under strict contractual confidentiality obligations.</li>
                <li><strong>Legal Authorities:</strong> When required by law, court order, regulatory authority, or government request under the IT Act, 2000 or any applicable Indian law.</li>
                <li><strong>Business Transfer:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred to the successor entity, who will be bound by this Policy.</li>
              </ul>
            </section>

            {/* 5. Data Retention */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Retention</h2>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Active Accounts:</strong> Data is retained for as long as your account is active and for 3 (three) years after account deletion to comply with legal and regulatory obligations.</li>
                <li><strong>Property Listings:</strong> Listing data is retained for as long as the listing is active. Expired or deleted listings are purged within 90 days.</li>
                <li><strong>Session Data:</strong> Login sessions expire automatically after 24 hours of inactivity.</li>
                <li><strong>Analytics Data:</strong> Anonymised, aggregated analytics data may be retained indefinitely as it does not constitute personal data.</li>
              </ul>
              <p className="mt-3">
                Upon fulfilment of the purpose or withdrawal of consent, we shall erase personal data
                unless retention is required by law, in accordance with Section 8(7) of the DPDPA, 2023.
              </p>
            </section>

            {/* 6. Data Security */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Security</h2>
              <p>
                We implement reasonable security practices and procedures as mandated under Rule 8
                of the SPDI Rules, 2011, including:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
                <li>HTTPS/TLS encryption for all data transmitted between your browser and our servers</li>
                <li>Access controls restricting personal data access to authorised personnel only</li>
                <li>Secure storage of authentication credentials with hashing</li>
                <li>Regular review of security practices</li>
              </ul>
              <p className="mt-3">
                While we take reasonable measures to protect your data, no method of transmission
                over the internet or electronic storage is 100% secure. We cannot guarantee absolute
                security of your data.
              </p>
            </section>

            {/* 7. Data Breach Notification */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Data Breach Notification</h2>
              <p>
                In the event of a personal data breach, we shall notify the Data Protection Board
                of India and affected Data Principals without unreasonable delay, in accordance with
                Section 8(6) of the DPDPA, 2023, providing details of the breach, data affected, and
                remedial measures taken.
              </p>
            </section>

            {/* 8. Your Rights as a Data Principal */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Your Rights as a Data Principal</h2>
              <p>Under the DPDPA, 2023 and SPDI Rules, 2011, you have the right to:</p>
              <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
                <li><strong>Right to Access (Section 11):</strong> Request a summary of your personal data being processed and the processing activities</li>
                <li><strong>Right to Correction &amp; Erasure (Section 12):</strong> Request correction of inaccurate or incomplete data, and erasure of data no longer necessary for the purpose collected</li>
                <li><strong>Right to Withdraw Consent (Section 6(4)):</strong> Withdraw your consent at any time with the ease comparable to the manner in which consent was given</li>
                <li><strong>Right to Grievance Redressal (Section 13):</strong> File a complaint with our Grievance Officer or escalate to the Data Protection Board of India</li>
                <li><strong>Right to Nominate (Section 14):</strong> Nominate another individual to exercise your rights in the event of death or incapacity</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, contact our Grievance Officer (see Section 10).
                We will respond to your request within 30 days.
              </p>
            </section>

            {/* 9. Children's Data */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Children&apos;s Data</h2>
              <p>
                The Platform is not intended for use by individuals under 18 years of age. We do not
                knowingly collect personal data from minors. If we become aware that we have collected
                data from a person under 18, we will take steps to delete such data promptly, in
                accordance with Section 9 of the DPDPA, 2023.
              </p>
            </section>

            {/* 10. Grievance Officer */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Grievance Officer</h2>
              <p>
                In accordance with Rule 5(9) of the SPDI Rules, 2011 and Section 13 of the DPDPA,
                2023, the following Grievance Officer is appointed to address your concerns regarding
                data processing:
              </p>
              <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                <p><strong className="text-gray-900">Name:</strong> Madhu Chandra</p>
                <p><strong className="text-gray-900">Designation:</strong> Proprietor &amp; Grievance Officer</p>
                <p>
                  <strong className="text-gray-900">Email:</strong>{' '}
                  <a href="mailto:contact@bharatbhoomi99.com" className="text-brand-primary hover:underline">contact@bharatbhoomi99.com</a>
                </p>
                <p>
                  <strong className="text-gray-900">Phone:</strong>{' '}
                  <a href="tel:+919448514449" className="text-brand-primary hover:underline">+91 94485 14449</a>
                </p>
                <p>
                  <strong className="text-gray-900">Address:</strong> No.99/1, Chandapura Dommasandra Road,
                  Kommasandra, Bengaluru – 562125, Karnataka, India
                </p>
              </div>
              <p className="mt-3">
                The Grievance Officer shall acknowledge your complaint within 24 hours and resolve
                it within 15 days from the date of receipt, or within such time as prescribed by law.
                If you are not satisfied with the resolution, you may file a complaint with the Data
                Protection Board of India.
              </p>
            </section>

            {/* 11. Cross-Border Data Transfer */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Cross-Border Data Transfer</h2>
              <p>
                Your data is primarily stored and processed within India. If any data is transferred
                outside India, such transfer will comply with the provisions of Section 16 of the
                DPDPA, 2023, and will only be made to jurisdictions not restricted by the Central
                Government of India.
              </p>
            </section>

            {/* 12. Changes to This Policy */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our data
                practices or legal requirements. The updated policy will be posted on this page with a
                revised &quot;Last Updated&quot; date. If changes are material, we will notify registered
                users via email or a prominent notice on the Platform. Continued use of the Platform
                after such changes constitutes your acceptance of the revised policy.
              </p>
            </section>

            {/* 13. Governing Law */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Governing Law</h2>
              <p>
                This Privacy Policy is governed by and construed in accordance with the laws of India.
                Any disputes arising out of or in connection with this policy shall be subject to the
                exclusive jurisdiction of the courts in Bengaluru, Karnataka, India.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
