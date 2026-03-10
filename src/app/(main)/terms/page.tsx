import type { Metadata } from 'next';
import { Container } from '@/components/layout';
import { SITE_CONFIG } from '@/lib/constants/seo';

const termsDescription = 'Terms of Service for Bharat Bhoomi-99. Read our terms and conditions governing the use of our property listing platform, in compliance with Indian law.';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: termsDescription,
  alternates: {
    canonical: `${SITE_CONFIG.url}/terms`,
  },
  openGraph: {
    title: `Terms of Service | ${SITE_CONFIG.name}`,
    description: termsDescription,
    url: `${SITE_CONFIG.url}/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="py-8 md:py-12">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-2">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Effective Date: 1 February 2026 &nbsp;|&nbsp; Last Updated: 9 February 2026
          </p>

          <div className="space-y-10 text-gray-600 leading-relaxed">
            {/* Introduction */}
            <section>
              <p>
                These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between
                you (&quot;User&quot;, &quot;you&quot;, or &quot;your&quot;) and Bharat Bhoomi-99
                (&quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), a proprietary
                concern operated by Madhu Chandra, with its registered address at No.99/1, Chandapura
                Dommasandra Road, Kommasandra, Bengaluru – 562125, Karnataka, India.
              </p>
              <p className="mt-3">
                By accessing or using the Platform at{' '}
                <span className="text-brand-primary">bharatbhoomi99.com</span>, you acknowledge that
                you have read, understood, and agree to be bound by these Terms, our{' '}
                <a href="/privacy" className="text-brand-primary hover:underline">Privacy Policy</a>,
                and all applicable laws and regulations. If you do not agree to these Terms, you must
                discontinue use of the Platform immediately.
              </p>
            </section>

            {/* 1. Definitions */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Definitions</h2>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>&quot;Platform&quot;</strong> means the website bharatbhoomi99.com, its subdomains, mobile-optimised versions, and all associated services.</li>
                <li><strong>&quot;User&quot;</strong> means any person who accesses, browses, or uses the Platform, including property seekers, property owners, and agents.</li>
                <li><strong>&quot;Listing&quot;</strong> means any property advertisement or description posted on the Platform by a property owner or agent.</li>
                <li><strong>&quot;Content&quot;</strong> means all text, images, photographs, data, property descriptions, and other materials uploaded, posted, or displayed on the Platform.</li>
                <li><strong>&quot;Services&quot;</strong> means the property listing, search, discovery, and communication facilitation services provided through the Platform.</li>
              </ul>
            </section>

            {/* 2. Nature of Service & Intermediary Status */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Nature of Service &amp; Intermediary Status</h2>
              <p>
                Bharat Bhoomi-99 is an <strong>intermediary</strong> within the meaning of Section 2(1)(w)
                of the Information Technology Act, 2000 (&quot;IT Act&quot;). The Platform provides an
                online marketplace that facilitates connections between property owners and
                buyers. We do not own, manage, develop, construct, or control any property listed on the
                Platform.
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
                <li>We act solely as a facilitator and do not participate in, endorse, or guarantee any property transaction between Users.</li>
                <li>We are entitled to the safe harbour protections available to intermediaries under Section 79 of the IT Act, 2000, subject to compliance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 (&quot;IT Rules, 2021&quot;).</li>
                <li>We do not verify the legal title, ownership, encumbrance status, or physical condition of any listed property unless explicitly stated.</li>
                <li>Any transaction, agreement, or arrangement between Users is solely between the parties involved. We bear no responsibility for the outcome of any such transaction.</li>
              </ul>
            </section>

            {/* 3. Eligibility */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Eligibility</h2>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>You must be at least 18 years of age and competent to enter into a contract as defined under Section 11 of the Indian Contract Act, 1872.</li>
                <li>If you are using the Platform on behalf of a company, partnership, or other legal entity, you represent that you have authority to bind such entity to these Terms.</li>
                <li>One natural person may maintain only one User account on the Platform.</li>
              </ul>
            </section>

            {/* 4. User Accounts */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. User Accounts</h2>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>You must provide accurate, current, and complete information during registration and keep your account information updated.</li>
                <li>You are solely responsible for maintaining the confidentiality of your login credentials and for all activities occurring under your account.</li>
                <li>You must notify us immediately at{' '}
                  <a href="mailto:contact@bharatbhoomi99.com" className="text-brand-primary hover:underline">contact@bharatbhoomi99.com</a>{' '}
                  if you become aware of any unauthorised use of your account.</li>
                <li>We reserve the right to suspend or terminate any account that we reasonably believe has been created with false information, is being used fraudulently, or violates these Terms.</li>
              </ul>
            </section>

            {/* 5. Property Listings */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Property Listings</h2>
              <h3 className="font-medium text-gray-800 mt-4 mb-2">5.1 Listing Obligations</h3>
              <p>Users who post property listings represent and warrant that:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
                <li>They are the lawful owner of the property, or are duly authorised by the owner to list it</li>
                <li>All information provided (including price, location, area, amenities, photographs) is accurate, truthful, and not misleading</li>
                <li>The property is free from any undisclosed legal disputes, encumbrances, or regulatory violations</li>
                <li>The listing complies with all applicable laws, including the Real Estate (Regulation and Development) Act, 2016 (&quot;RERA&quot;) where applicable</li>
                <li>Photographs and media are genuine representations of the actual property and are not stock images or digitally altered to misrepresent the property</li>
              </ul>

              <h3 className="font-medium text-gray-800 mt-4 mb-2">5.2 Prohibited Listings</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Duplicate listings for the same property</li>
                <li>Properties involved in pending litigation without disclosure</li>
                <li>Listings with intentionally misleading pricing, area measurements, or amenities</li>
                <li>Properties that violate local zoning laws, building regulations, or municipal guidelines</li>
              </ul>

              <h3 className="font-medium text-gray-800 mt-4 mb-2">5.3 Content Removal</h3>
              <p>
                We reserve the right to remove, modify, or de-list any Listing at our sole discretion,
                without prior notice, if it violates these Terms, applicable law, or our content guidelines.
                We may also remove content in response to a valid legal order or complaint received under
                Rule 3(1)(d) of the IT Rules, 2021.
              </p>
            </section>

            {/* 6. User Conduct */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. User Conduct</h2>
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
                <li>Post false, misleading, defamatory, obscene, or fraudulent content</li>
                <li>Impersonate any person or entity, or misrepresent your affiliation with any person or entity</li>
                <li>Harass, spam, threaten, or send unsolicited commercial communications to other Users</li>
                <li>Use the Platform for any purpose that is unlawful under the IT Act, 2000, Indian Penal Code (now Bharatiya Nyaya Sanhita, 2023), or any other applicable law</li>
                <li>Attempt to gain unauthorised access to other User accounts, Platform systems, or networks</li>
                <li>Use automated tools, bots, scrapers, or crawlers to collect data from the Platform without prior written consent</li>
                <li>Circumvent, disable, or interfere with any security features of the Platform</li>
                <li>Engage in any activity that constitutes an offence under Sections 43, 66, 66C, 66D, or 67 of the IT Act, 2000</li>
              </ul>
              <p className="mt-3">
                Violation of this section may result in immediate account suspension or termination,
                and may be reported to the appropriate law enforcement authorities.
              </p>
            </section>

            {/* 7. RERA Disclaimer */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. RERA Compliance Disclaimer</h2>
              <p>
                The Real Estate (Regulation and Development) Act, 2016 (&quot;RERA&quot;) regulates the
                sale of under-construction and new real estate projects. Users are advised to:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
                <li>Independently verify the RERA registration status of any project or developer before entering into any transaction</li>
                <li>Request and review the RERA registration number from the property owner or developer</li>
                <li>Check the Karnataka RERA (<a href="https://rera.karnataka.gov.in" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">rera.karnataka.gov.in</a>) website for project verification</li>
              </ul>
              <p className="mt-3">
                Bharat Bhoomi-99 does not guarantee the RERA compliance status of any listed property
                or project. Display of any listing on the Platform does not constitute an endorsement of
                its RERA compliance status.
              </p>
            </section>

            {/* 8. No Professional Advice */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. No Professional Advice</h2>
              <p>
                The information provided on the Platform, including property listings, price estimates,
                area descriptions, and market commentary, is for general informational purposes only and
                does not constitute legal, financial, investment, or professional advice. Users should
                seek independent professional advice from qualified legal, financial, or real estate
                professionals before making any property-related decisions or entering into transactions.
              </p>
            </section>

            {/* 9. Intellectual Property */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Intellectual Property</h2>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>The Platform design, logos, trademarks, service marks, trade names, and brand elements of Bharat Bhoomi-99 are the exclusive property of Madhu Chandra and are protected under the Trade Marks Act, 1999 and the Copyright Act, 1957.</li>
                <li>Users retain ownership of the Content they upload but grant us a non-exclusive, royalty-free, worldwide licence to use, display, reproduce, and distribute such Content solely for the purpose of operating and promoting the Platform.</li>
                <li>You may not copy, reproduce, distribute, modify, create derivative works from, or publicly display any part of the Platform or its Content without prior written consent, except as permitted by the Copyright Act, 1957.</li>
              </ul>
            </section>

            {/* 10. Disclaimer of Warranties */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Disclaimer of Warranties</h2>
              <p>
                THE PLATFORM AND ALL SERVICES ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS
                AVAILABLE&quot; BASIS WITHOUT ANY WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED,
                OR STATUTORY, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
                <li>The accuracy, completeness, reliability, or timeliness of any Listing or Content</li>
                <li>The legality or validity of any property title, ownership claim, or transaction</li>
                <li>The fitness of any listed property for a particular purpose</li>
                <li>Uninterrupted, secure, or error-free operation of the Platform</li>
                <li>The identity, credentials, or bona fides of any User or property owner</li>
              </ul>
              <p className="mt-3">
                Users acknowledge that property transactions involve inherent risks and agree to
                independently verify all property details, conduct physical site visits, obtain
                legal opinions on title documents, and complete due diligence before entering into
                any binding agreement.
              </p>
            </section>

            {/* 11. Limitation of Liability */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Limitation of Liability</h2>
              <p>To the maximum extent permitted by applicable Indian law:</p>
              <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
                <li>Bharat Bhoomi-99 and its proprietor shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the Platform, any property transaction, or reliance on any Listing or Content.</li>
                <li>We shall not be liable for any loss, damage, or injury arising from any transaction or interaction between Users, including but not limited to fraud, misrepresentation, non-performance, or breach of contract by any User.</li>
                <li>Our total aggregate liability, if any, for all claims arising under these Terms shall not exceed the total fees paid by you to the Platform in the twelve (12) months preceding the event giving rise to the claim, or INR 5,000 (Rupees Five Thousand), whichever is lower.</li>
                <li>Nothing in these Terms excludes or limits liability for fraud, wilful misconduct, or any liability that cannot be excluded under applicable Indian law, including the Consumer Protection Act, 2019.</li>
              </ul>
            </section>

            {/* 12. Indemnification */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Bharat Bhoomi-99, its proprietor
                Madhu Chandra, and any associated employees, agents, or representatives from and against
                any claims, liabilities, damages, losses, costs, or expenses (including reasonable legal
                fees) arising out of or in connection with:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
                <li>Your breach of these Terms or any applicable law</li>
                <li>Your use of the Platform or Services</li>
                <li>Any Content you upload, post, or transmit through the Platform</li>
                <li>Any property transaction you enter into with another User</li>
                <li>Your violation of any rights of a third party</li>
              </ul>
            </section>

            {/* 13. Third-Party Links */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Third-Party Links</h2>
              <p>
                The Platform may contain links to third-party websites, services, or resources. These
                links are provided for convenience only. We do not endorse, control, or assume
                responsibility for the content, privacy policies, or practices of any third-party
                websites. Access to third-party websites is at your own risk.
              </p>
            </section>

            {/* 14. Termination */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">14. Termination</h2>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>You may terminate your account at any time by contacting us at{' '}
                  <a href="mailto:contact@bharatbhoomi99.com" className="text-brand-primary hover:underline">contact@bharatbhoomi99.com</a>.</li>
                <li>We may suspend or terminate your account immediately, without prior notice, if you breach these Terms, engage in fraudulent activity, or if required by law.</li>
                <li>Upon termination, your right to access the Platform ceases immediately. Provisions that by their nature should survive termination (including Sections 9, 10, 11, 12, 16, and 17) shall survive.</li>
                <li>We may retain your data post-termination in accordance with our <a href="/privacy" className="text-brand-primary hover:underline">Privacy Policy</a> and applicable legal requirements.</li>
              </ul>
            </section>

            {/* 15. Modifications to Terms */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">15. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. The updated Terms will be posted
                on this page with a revised &quot;Last Updated&quot; date. If changes are material, we
                will provide notice to registered Users via email or a prominent notice on the Platform.
                Your continued use of the Platform after the effective date of any modifications
                constitutes your acceptance of the revised Terms. If you do not agree to the modified
                Terms, you must discontinue use of the Platform.
              </p>
            </section>

            {/* 16. Governing Law & Jurisdiction */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">16. Governing Law &amp; Dispute Resolution</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India,
                including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
                <li>The Information Technology Act, 2000 and rules made thereunder</li>
                <li>The Indian Contract Act, 1872</li>
                <li>The Consumer Protection Act, 2019</li>
                <li>The Real Estate (Regulation and Development) Act, 2016</li>
              </ul>
              <p className="mt-3">
                Any dispute, controversy, or claim arising out of or relating to these Terms or the
                Platform shall first be attempted to be resolved through amicable negotiation between
                the parties within 30 days. If the dispute remains unresolved, it shall be subject to
                the <strong>exclusive jurisdiction of the courts in Bengaluru, Karnataka, India</strong>.
              </p>
            </section>

            {/* 17. Grievance Redressal */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">17. Grievance Redressal</h2>
              <p>
                In accordance with Rule 3(2) of the Information Technology (Intermediary Guidelines
                and Digital Media Ethics Code) Rules, 2021, and Section 13 of the Digital Personal
                Data Protection Act, 2023, the following Grievance Officer is appointed:
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
                The Grievance Officer shall acknowledge your complaint within 24 hours and resolve it
                within 15 days from the date of receipt, in compliance with Rule 3(2) of the IT Rules,
                2021. If you are unsatisfied with the resolution, you may escalate the matter to the
                appropriate regulatory or judicial authority.
              </p>
            </section>

            {/* 18. Consumer Rights */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">18. Consumer Rights</h2>
              <p>
                Nothing in these Terms shall be construed to limit or exclude any rights available
                to you under the Consumer Protection Act, 2019 and the Consumer Protection
                (E-Commerce) Rules, 2020. You retain all rights to file complaints with the
                appropriate Consumer Disputes Redressal Commission or through the National Consumer
                Helpline (<a href="https://consumerhelpline.gov.in" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">consumerhelpline.gov.in</a>).
              </p>
            </section>

            {/* 19. Force Majeure */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">19. Force Majeure</h2>
              <p>
                We shall not be liable for any failure or delay in performing our obligations under
                these Terms if such failure or delay results from circumstances beyond our reasonable
                control, including but not limited to natural disasters, pandemics, government orders,
                internet or telecommunications failures, cyberattacks, strikes, or other force majeure
                events.
              </p>
            </section>

            {/* 20. Severability */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">20. Severability &amp; Waiver</h2>
              <p>
                If any provision of these Terms is found to be invalid, illegal, or unenforceable by
                a court of competent jurisdiction, the remaining provisions shall continue in full force
                and effect. The invalid provision shall be modified to the minimum extent necessary to
                make it valid and enforceable while preserving its original intent.
              </p>
              <p className="mt-3">
                The failure of Bharat Bhoomi-99 to enforce any right or provision of these Terms shall
                not constitute a waiver of such right or provision.
              </p>
            </section>

            {/* 21. Contact */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">21. Contact Information</h2>
              <p>
                For any questions, concerns, or feedback regarding these Terms of Service, you may
                contact us at:
              </p>
              <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                <p><strong className="text-gray-900">Bharat Bhoomi-99</strong></p>
                <p>
                  <strong className="text-gray-900">Email:</strong>{' '}
                  <a href="mailto:contact@bharatbhoomi99.com" className="text-brand-primary hover:underline">contact@bharatbhoomi99.com</a>
                </p>
                <p>
                  <strong className="text-gray-900">Phone:</strong>{' '}
                  <a href="tel:+919448514449" className="text-brand-primary hover:underline">+91 94485 14449</a>
                  {' / '}
                  <a href="tel:+919900151820" className="text-brand-primary hover:underline">+91 99001 51820</a>
                </p>
                <p>
                  <strong className="text-gray-900">Address:</strong> No.99/1, Chandapura Dommasandra Road,
                  Kommasandra, Bengaluru – 562125, Karnataka, India
                </p>
              </div>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
