import React from 'react';

// Privacy Policy and Terms & Conditions share one layout: a white title strip
// that clears the fixed navbar, then numbered sections of body copy. Content
// lives in the DOCS map below so both pages stay in sync stylistically.

const COMPANY = 'Dugar Brothers and Sons Pvt. Ltd.';
const CONTACT_EMAIL = 'Sales.Mahindra@mvdugar.com';
const OFFICE = 'Balaju Industrial Area, Kathmandu, Nepal';

const DOCS = {
  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy Policy.',
    intro: `This policy explains what information ${COMPANY} collects through this website, why we collect it, and what we do with it. It applies to this site only, not to any Mahindra & Mahindra Ltd. website or to third-party sites we link to.`,
    sections: [
      {
        heading: 'Information we collect',
        body: [
          'We collect the details you give us directly. On the booking and enquiry forms that means your name, phone number, email address, the vehicle or division you are interested in, and any message you write.',
          'We also collect basic technical information that your browser sends on every visit: IP address, device and browser type, the pages you open, and the time of each request. This is standard server and analytics data and is not linked to your name.',
        ],
      },
      {
        heading: 'How we use it',
        body: [
          'Contact details are used to respond to your enquiry, arrange a test drive, prepare a quotation, and follow up on service or spare-parts requests.',
          'Technical data is used to keep the site working, diagnose faults, and understand which pages are useful so we can improve them.',
          'We do not sell your information, and we do not use it for automated decision-making.',
        ],
      },
      {
        heading: 'Who we share it with',
        body: [
          'Your enquiry may be shared with the relevant Dugar Brothers and Sons branch handling your region, and with Mahindra & Mahindra Ltd. or its authorised partners where a warranty, financing, or manufacturer programme requires it.',
          'We also use service providers to run the site (hosting, email delivery, map and analytics services). They process data on our instructions only.',
          'We disclose information to authorities where Nepali law requires it.',
        ],
      },
      {
        heading: 'Cookies and analytics',
        body: [
          'The site uses cookies and similar storage to remember your session and to measure traffic. You can block or delete cookies in your browser settings; the site will still work, though some conveniences may be lost.',
        ],
      },
      {
        heading: 'How long we keep it',
        body: [
          'Enquiry and booking records are kept for as long as needed to serve you and to meet our accounting and warranty obligations. Technical logs are kept for a short period and then discarded.',
        ],
      },
      {
        heading: 'Your choices',
        body: [
          `You can ask us for a copy of the information we hold about you, ask us to correct it, or ask us to delete it where we are not required to keep it. Write to ${CONTACT_EMAIL} and we will respond.`,
          'You can opt out of follow-up calls or messages at any time by telling the representative handling your enquiry.',
        ],
      },
      {
        heading: 'Security',
        body: [
          'Enquiry data is transmitted over an encrypted connection and stored on access-controlled systems. No online service can promise perfect security, but we take reasonable technical and organisational measures to protect what you send us.',
        ],
      },
      {
        heading: 'Changes to this policy',
        body: [
          'We may update this policy as our practices or the law change. The revised version takes effect when it is published on this page.',
        ],
      },
      {
        heading: 'Contact',
        body: [
          `Questions about this policy can be sent to ${CONTACT_EMAIL}, or by post to ${COMPANY}, ${OFFICE}.`,
        ],
      },
    ],
  },

  terms: {
    eyebrow: 'Legal',
    title: 'Terms & Conditions.',
    intro: `These terms govern your use of this website, operated by ${COMPANY}, authorised Mahindra dealer in Nepal. By browsing the site or submitting an enquiry, you accept them.`,
    sections: [
      {
        heading: 'Use of this site',
        body: [
          'You may browse the site and use its forms for genuine enquiries about our vehicles and services. You may not attempt to disrupt the site, extract data by automated means, or use it for anything unlawful.',
        ],
      },
      {
        heading: 'Vehicle information and pricing',
        body: [
          'Specifications, images, features, and prices shown here are indicative and are provided for general guidance. Manufacturer specifications change, and colours and fittings may differ from the photographs shown.',
          'Prices are exclusive of taxes, registration, insurance, and any charge not expressly stated, and are subject to change without notice. The price and specification confirmed in writing at the time of purchase is the one that applies.',
        ],
      },
      {
        heading: 'Enquiries and bookings',
        body: [
          'Submitting a booking or enquiry form is a request, not a purchase. It does not reserve a vehicle, create a sale, or bind either party. A sale is concluded only through a signed order and the applicable payment terms.',
          'Test drives are subject to vehicle availability, a valid driving licence, and our safety requirements.',
        ],
      },
      {
        heading: 'Warranty and service',
        body: [
          'Vehicles are covered by the manufacturer warranty issued by Mahindra & Mahindra Ltd. and by the terms in your warranty booklet. Nothing on this website extends, replaces, or varies that warranty.',
        ],
      },
      {
        heading: 'Intellectual property',
        body: [
          'The text, layout, photographs, and graphics on this site belong to us or are used with permission. The Mahindra name, logo, and product marks belong to Mahindra & Mahindra Ltd. You may not reproduce this material for commercial use without written consent.',
        ],
      },
      {
        heading: 'Third-party links',
        body: [
          'The site links to services we do not control, including map providers and manufacturer pages. We are not responsible for their content or their handling of your data.',
        ],
      },
      {
        heading: 'Limitation of liability',
        body: [
          'The site is provided as it is. To the extent permitted by law, we are not liable for indirect or consequential loss arising from use of the site or from reliance on information published here. Nothing in these terms limits liability that cannot be limited by law.',
        ],
      },
      {
        heading: 'Governing law',
        body: [
          'These terms are governed by the laws of Nepal, and the courts of Kathmandu have jurisdiction over any dispute arising from them.',
        ],
      },
      {
        heading: 'Contact',
        body: [
          `Questions about these terms can be sent to ${CONTACT_EMAIL}, or by post to ${COMPANY}, ${OFFICE}.`,
        ],
      },
    ],
  },
};

export default function Legal({ doc = 'privacy' }) {
  const content = DOCS[doc] ?? DOCS.privacy;

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {/* Title strip — pt clears the 120px fixed navbar plus breathing room */}
      <section className="max-w-4xl mx-auto px-6 lg:px-10 pt-[160px] pb-12">
        <p className="text-[#e31837] text-xs font-bold uppercase tracking-[0.3em] mb-5">
          {content.eyebrow}
        </p>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-950 uppercase tracking-tight leading-[1.05] after:content-[''] after:block after:w-14 after:h-1 after:bg-[#e31837] after:rounded-full after:mt-6">
          {content.title}
        </h1>
        <p className="text-gray-500 text-base leading-relaxed mt-8">
          {content.intro}
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 lg:px-10 pb-24">
        <div className="space-y-12">
          {content.sections.map((section, i) => (
            <div key={section.heading}>
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-[#e31837] text-sm font-black tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="text-gray-950 text-xl font-black uppercase tracking-tight leading-tight">
                  {section.heading}
                </h2>
              </div>
              <div className="space-y-4 pl-0 sm:pl-10">
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="text-gray-500 text-base leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
