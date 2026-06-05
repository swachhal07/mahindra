import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'dugar_lang';

// Translation dictionary.
// Keys are dot-namespaced by area. To add a new translatable string:
//   1. Add the key under BOTH `en` and `ne`
//   2. Use `const t = useT(); t('key')` in the component
const translations = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.showcase': 'Vehicle Showcase',
    'nav.about': 'About Us',
    'nav.contact': 'Contact Us',

    // Footer CTA banner
    'footer.eyebrow': 'Ready to Experience It?',
    'footer.title': 'Book a Test Drive Today.',
    'footer.bookCta': 'Book Test Drive',
    'footer.contactCta': 'Contact Us',

    // Home — hero slides (tag / headline / sub)
    'home.slide0.tag': 'Heavy Haulage',
    'home.slide0.headline': 'Logistics You Can\nCount On, Start to Finish.',
    'home.slide0.sub': 'We specialise in heavy commercial trucking, premium haulage solutions, and high-performance engineering built for any terrain.',
    'home.slide1.tag': 'Cargo & Logistics',
    'home.slide1.headline': 'Maximise Profits.\nMinimise Downtime.',
    'home.slide1.sub': 'High-payload cargo solutions designed for optimal mileage and effortless long-distance operations across the country.',
    'home.slide2.tag': 'Tipper Efficiency',
    'home.slide2.headline': 'Power That Moves\nIndustries Forward.',
    'home.slide2.sub': 'The Mahindra Blazo X Tipper redefines long-haul efficiency with intelligent fuel management and class-leading reliability.',
    'home.slide3.tag': 'Next-Gen Commercials',
    'home.slide3.headline': 'Next-Gen Efficiency,\nBuilt For Tomorrow.',
    'home.slide3.sub': 'Redefining the heavy commercial segment with high-productivity features and world-class driver comfort.',
    'home.slide4.tag': 'Smart Construction',
    'home.slide4.headline': 'Smart Technology.\nPrecision Performance.',
    'home.slide4.sub': 'Advanced earthmoving machinery engineered for maximum output, lowest fuel consumption, and absolute durability.',

    // Home — section eyebrows + titles
    'home.whatWeDo.eyebrow': 'WHAT WE DO',
    'home.whatWeDo.title': "POWERING NEPAL'S\nCOMMERCIAL BACKBONE.",
    'home.divisions.eyebrow': 'OUR DIVISIONS',
    'home.divisions.title': 'VEHICLES ENGINEERED\nTO PERFORM.',
    'home.reviews.eyebrow': 'CLIENT REVIEWS',
    'home.reviews.title': 'TRUSTED BY THE FLEET OWNERS.',
    'home.faq.eyebrow': 'QUESTIONS & ANSWERS',
    'home.faq.title': 'FREQUENTLY ASKED QUESTIONS.',

    // Showcase — hero
    'showcase.eyebrow': 'Mahindra Fleet',
    'showcase.headline1': 'Explore the',
    'showcase.headline2': 'Showcase.',
    'showcase.sub': 'From heavy commercial trucks to last-mile movers and earthmoving machinery, find the Mahindra built for your work.',
    'showcase.viewDetails': 'View Details',
    'showcase.filter.all': 'All Models',
    'showcase.filter.truck': 'Trucks',
    'showcase.filter.tipper': 'Tippers',
    'showcase.filter.light': 'Light Commercials',
    'showcase.filter.construction': 'Construction',

    // About — hero
    'about.eyebrow': 'About Dugar Auto Clinic',
    'about.headline1': "Nepal's Trusted.",
    'about.headline2': 'Mahindra Partner.',
    'about.sub': 'We deliver world-class Mahindra vehicles and after-sales service across Nepal — from heavy commercial trucks to light city movers, all under one roof.',
    'about.ourStory': 'Our Story',
    'about.trustedPartners': 'Trusted Partners',
    'about.trustedPartners.title': "Working with Nepal's best.",
    'about.howWeWork': 'How We Work',
    'about.howWeWork.title': 'A simple, repeatable standard.',
    'about.whoWeServe': 'Who We Serve',
    'about.whoWeServe.title': 'Mahindra for every kind of work.',

    // Booking — hero
    'booking.eyebrow': 'Get in Touch',
    'booking.headline1': 'Get a Quote.',
    'booking.headline2': 'Get a Schedule.',
    'booking.sub': 'Tell us about your fleet or your project. We will walk you through the right Mahindra, write a clear quote, and lock in a schedule you can plan around.',
    'booking.reachUs': 'Reach Us',
    'booking.reachUs.title': 'Call, email,\nor send the form.',
    'booking.submit': 'Book Experience Slot',
  },
  ne: {
    // Navbar
    'nav.home': 'गृह पृष्ठ',
    'nav.showcase': 'वाहन प्रदर्शन',
    'nav.about': 'हाम्रोबारे',
    'nav.contact': 'सम्पर्क गर्नुहोस्',

    // Footer CTA banner
    'footer.eyebrow': 'अनुभव गर्न तयार हुनुहुन्छ?',
    'footer.title': 'आज टेस्ट ड्राइभ बुक गर्नुहोस्।',
    'footer.bookCta': 'टेस्ट ड्राइभ बुक गर्नुहोस्',
    'footer.contactCta': 'सम्पर्क गर्नुहोस्',

    // Home — hero slides
    'home.slide0.tag': 'भारी ढुवानी',
    'home.slide0.headline': 'सुरुदेखि अन्त्यसम्म\nभरपर्दो लजिस्टिक्स।',
    'home.slide0.sub': 'हामी भारी व्यावसायिक ट्रकिङ, उच्चस्तरीय ढुवानी समाधान, र कुनै पनि भूभागको लागि बनाइएको उच्च-प्रदर्शन इन्जिनियरिङमा विशेषज्ञता राख्छौं।',
    'home.slide1.tag': 'कार्गो र लजिस्टिक्स',
    'home.slide1.headline': 'मुनाफा बढाउनुहोस्।\nडाउनटाइम घटाउनुहोस्।',
    'home.slide1.sub': 'देशभरि उत्कृष्ट माइलेज र सहज लामो दूरीको सञ्चालनको लागि डिजाइन गरिएको उच्च-पेलोड कार्गो समाधान।',
    'home.slide2.tag': 'टिपर दक्षता',
    'home.slide2.headline': 'उद्योगलाई अघि बढाउने\nशक्ति।',
    'home.slide2.sub': 'महिन्द्रा ब्लाजो एक्स टिपरले बुद्धिमान इन्धन व्यवस्थापन र क्लास-अग्रणी विश्वसनीयताका साथ लामो ढुवानी दक्षतालाई पुनःपरिभाषित गर्छ।',
    'home.slide3.tag': 'अर्को-पुस्ताका व्यावसायिक',
    'home.slide3.headline': 'अर्को-पुस्ताको दक्षता,\nभोलिको लागि बनाइएको।',
    'home.slide3.sub': 'उच्च-उत्पादकता सुविधाहरू र विश्वस्तरीय चालक आरामका साथ भारी व्यावसायिक खण्डलाई पुनःपरिभाषित गर्दै।',
    'home.slide4.tag': 'स्मार्ट निर्माण',
    'home.slide4.headline': 'स्मार्ट प्रविधि।\nसटीक प्रदर्शन।',
    'home.slide4.sub': 'अधिकतम उत्पादन, न्यूनतम इन्धन खपत, र पूर्ण टिकाउपनको लागि इन्जिनियर गरिएको उन्नत अर्थमुभिङ मेसिनरी।',

    // Home — section eyebrows + titles
    'home.whatWeDo.eyebrow': 'हामी के गर्छौं',
    'home.whatWeDo.title': 'नेपालको व्यावसायिक\nमेरुदण्डलाई शक्ति प्रदान गर्दै।',
    'home.divisions.eyebrow': 'हाम्रा डिभिजनहरू',
    'home.divisions.title': 'प्रदर्शन गर्न\nइन्जिनियर गरिएका वाहनहरू।',
    'home.reviews.eyebrow': 'ग्राहक समीक्षाहरू',
    'home.reviews.title': 'फ्लीट मालिकहरूद्वारा विश्वासिलो।',
    'home.faq.eyebrow': 'प्रश्न र उत्तरहरू',
    'home.faq.title': 'बारम्बार सोधिने प्रश्नहरू।',

    // Showcase — hero
    'showcase.eyebrow': 'महिन्द्रा फ्लीट',
    'showcase.headline1': 'शोकेस',
    'showcase.headline2': 'अन्वेषण गर्नुहोस्।',
    'showcase.sub': 'भारी व्यावसायिक ट्रकदेखि लास्ट-माइल ढुवानी र अर्थमुभिङ मेसिनरीसम्म, तपाईंको कामको लागि बनाइएको महिन्द्रा भेट्टाउनुहोस्।',
    'showcase.viewDetails': 'विवरण हेर्नुहोस्',
    'showcase.filter.all': 'सबै मोडेलहरू',
    'showcase.filter.truck': 'ट्रकहरू',
    'showcase.filter.tipper': 'टिपरहरू',
    'showcase.filter.light': 'हल्का व्यावसायिक',
    'showcase.filter.construction': 'निर्माण',

    // About — hero
    'about.eyebrow': 'दुगर अटो क्लिनिकको बारेमा',
    'about.headline1': 'नेपालको विश्वसनीय।',
    'about.headline2': 'महिन्द्रा साझेदार।',
    'about.sub': 'हामी नेपालभरि विश्वस्तरीय महिन्द्रा वाहन र बिक्री पछिको सेवा प्रदान गर्छौं — भारी व्यावसायिक ट्रकदेखि हल्का सिटी मुभरसम्म, सबै एकै ठाउँमा।',
    'about.ourStory': 'हाम्रो कथा',
    'about.trustedPartners': 'विश्वसनीय साझेदारहरू',
    'about.trustedPartners.title': "नेपालका उत्कृष्टहरूसँग काम गर्दै।",
    'about.howWeWork': 'हामी कसरी काम गर्छौं',
    'about.howWeWork.title': 'एक सरल, दोहोर्‍याउन सकिने मापदण्ड।',
    'about.whoWeServe': 'हामी कसलाई सेवा गर्छौं',
    'about.whoWeServe.title': 'हरेक प्रकारको कामको लागि महिन्द्रा।',

    // Booking — hero
    'booking.eyebrow': 'सम्पर्कमा रहनुहोस्',
    'booking.headline1': 'कोटेशन प्राप्त गर्नुहोस्।',
    'booking.headline2': 'तालिका प्राप्त गर्नुहोस्।',
    'booking.sub': 'तपाईंको फ्लीट वा परियोजनाको बारेमा हामीलाई बताउनुहोस्। हामी तपाईंलाई सही महिन्द्रा छनोट गर्न मद्दत गर्नेछौं, स्पष्ट कोटेशन लेख्नेछौं, र तपाईंले योजना बनाउन सक्ने तालिका तय गर्नेछौं।',
    'booking.reachUs': 'हामीलाई सम्पर्क गर्नुहोस्',
    'booking.reachUs.title': 'कल गर्नुहोस्, इमेल गर्नुहोस्,\nवा फारम पठाउनुहोस्।',
    'booking.submit': 'अनुभव स्लट बुक गर्नुहोस्',
  },
};

const LanguageContext = createContext({ lang: 'en', setLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'ne' || stored === 'en' ? stored : 'en';
    } catch {
      return 'en';
    }
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    try { localStorage.setItem(STORAGE_KEY, newLang); } catch (e) { /* ignore */ }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.classList.toggle('lang-ne', lang === 'ne');
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}

// Returns a translator function. Falls back to English, then to the raw key.
export function useT() {
  const { lang } = useContext(LanguageContext);
  return (key) => {
    const bucket = translations[lang] || translations.en;
    return bucket[key] ?? translations.en[key] ?? key;
  };
}
