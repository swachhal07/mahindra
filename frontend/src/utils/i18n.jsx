// English-only string dictionary.
//
// The site previously had a Nepali toggle; it was removed. This file keeps
// the `useT()` helper so every existing `t('key')` call across the app
// continues to work without a refactor — it just always returns the English
// string for the given key (falling back to the key itself if missing).

const translations = {
  // Navbar
  'nav.home': 'Home',
  'nav.showcase': 'Vehicle Showcase',
  'nav.about': 'About Us',
  'nav.blog': 'Blog',
  'nav.contact': 'Contact Us',

  // Footer CTA banner
  'footer.eyebrow': 'Ready to Experience It?',
  'footer.title': 'Book a Test Drive Today.',
  'footer.bookCta': 'Book Test Drive',
  'footer.contactCta': 'Contact Us',

  // Home — hero slides
  'home.slide0.tag': 'Heavy Haulage',
  'home.slide0.headline': 'Mahindra Commercial Fleet',
  'home.slide0.sub': 'Built for any terrain.',
  'home.slide1.tag': 'Cargo & Logistics',
  'home.slide1.headline': 'Mahindra BlazoX 35 Cargo',
  'home.slide1.sub': 'Maximise profits. Minimise downtime.',
  'home.slide2.tag': 'Tipper Efficiency',
  'home.slide2.headline': 'Mahindra BlazoX Tipper',
  'home.slide2.sub': 'Power that moves industries forward.',
  'home.slide3.tag': 'Passenger Transport',
  'home.slide3.headline': 'Mahindra Cruzio Grande Bus',
  'home.slide3.sub': 'Comfort and reliability for every journey.',
  'home.slide4.tag': 'Smart Construction',
  'home.slide4.headline': 'Mahindra EarthMaster SX 90',
  'home.slide4.sub': 'Smart technology. Precision performance.',

  // Home — section eyebrows + titles
  'home.whatWeDo.eyebrow': 'WHAT WE DO',
  'home.whatWeDo.title': "POWERING NEPAL'S\nCOMMERCIAL BACKBONE.",
  'home.divisions.eyebrow': 'OUR DIVISIONS',
  'home.divisions.title': 'VEHICLES ENGINEERED\nTO PERFORM.',
  'home.reviews.eyebrow': 'CLIENT REVIEWS',
  'home.reviews.title': 'TRUSTED BY THE FLEET OWNERS.',
  'home.reviews.googleCta': 'View Reviews on Google',
  'home.faq.eyebrow': 'QUESTIONS & ANSWERS',
  'home.faq.title': 'FREQUENTLY ASKED QUESTIONS.',

  // Showcase
  'showcase.eyebrow': 'Mahindra Fleet',
  'showcase.headline1': 'Explore the',
  'showcase.headline2': 'Showcase.',
  'showcase.sub': 'From heavy commercial trucks to last-mile movers and earthmoving machinery, find the Mahindra built for your work.',
  'showcase.viewDetails': 'View Details',
  'showcase.back': 'Back to Showcase',
  'showcase.keySpecs': 'Key Specifications',
  'showcase.bookTestDrive': 'Book a Test Drive',
  'showcase.spec.category': 'Category',
  'showcase.spec.payload': 'Payload',
  'showcase.spec.engine': 'Engine',
  'showcase.spec.useCase': 'Use Case',
  'showcase.spec.power': 'Power',
  'showcase.spec.drive': 'Drive',
  'showcase.filter.all': 'All Models',
  'showcase.filter.truck': 'Trucks',
  'showcase.filter.tipper': 'Tippers',
  'showcase.filter.light': 'Light Commercials',
  'showcase.filter.construction': 'Construction',
  'showcase.filter.bus': 'Buses',

  // About
  'about.eyebrow': 'About Dugar Auto Clinic',
  'about.headline1': "Nepal's Trusted.",
  'about.headline2': 'Mahindra Partner.',
  'about.sub': 'We deliver world-class Mahindra vehicles and after-sales service across Nepal — from heavy commercial trucks to light city movers, all under one roof.',
  'about.ourStory': 'Our Story',
  'about.trustedPartners': 'Trusted Partners',
  'about.trustedPartners.title': "Working with Nepal's best.",
  'about.ourTeam': 'Meet Our Team',
  'about.ourTeam.title': 'The people behind every Mahindra you drive.',
  'about.whoWeServe': 'Who We Serve',
  'about.whoWeServe.title': 'Mahindra for every kind of work.',

  // Booking
  'booking.eyebrow': 'Get in Touch',
  'booking.headline1': 'Get a Quote.',
  'booking.headline2': 'Get a Schedule.',
  'booking.sub': 'Tell us about your fleet or your project. We will walk you through the right Mahindra, write a clear quote, and lock in a schedule you can plan around.',
  'booking.reachUs': 'Reach Us',
  'booking.reachUs.title': 'Call, email,\nor send the form.',
  'booking.submit': 'Book Experience Slot',

  // Blog
  'blog.eyebrow': 'Insights & Stories',
  'blog.headline1': 'From the Garage',
  'blog.headline2': 'to Your Fleet.',
  'blog.sub': 'Practical knowledge for fleet operators, builders, and drivers — written by our team in Kathmandu.',
  'blog.readMore': 'Read Article',
  'blog.back': 'Back to Blog',
};

// Returns a translator function. English only — kept so existing `t('key')`
// calls keep compiling without refactoring every page.
export function useT() {
  return (key) => translations[key] ?? key;
}
