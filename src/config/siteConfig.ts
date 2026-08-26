// Central configuration for Cortek Enterprises
// Easily update contact info, WhatsApp numbers, social links, and store details.

export const SITE_CONFIG = {
  storeName: "CORTEK ENTERPRISES",
  tagline: "Trusted Pre-Owned Phones, Laptops, Watches & Gadgets.",
  subTagline: "Buy certified pre-owned electronics with 100% transparent pricing, honest condition details, and battery health in Karol Bagh, New Delhi.",
  
  // Central WhatsApp number - Updated with official Cortek contact
  whatsappNumber: "+919582804151", // Store WhatsApp
  callingNumber: "+919582804151",
  displayPhone: "+91 95828 04151",
  alternatePhone: "+91 95828 04181",
  supportPhone2: "+91 93541 15602",
  email: "contact@cortekenterprises.com",
  
  // Official Links provided in spec
  whatsappCommunityUrl: "https://chat.whatsapp.com/CunY6GRbXixHwKSqj9ekR8",
  instagramUrl: "https://www.instagram.com/cortekenterprises/?hl=en",
  youtubeUrl: "https://www.youtube.com/channel/UC6aZ-nyA5gkf9CqTGgffAcA",
  facebookUrl: "https://www.facebook.com/shhaad.khhaan/",
  googleUrl: "https://share.google/DXdLrGTDSMuSSQywK",
  googleReviewsUrl: "https://share.google/4waa5sfwEQSqvlN8D",
  
  // Physical Store Details in Karol Bagh
  location: {
    name: "Cortek Enterprises Karol Bagh",
    addressLine1: "Gaffar Market / Arya Samaj Road Area",
    area: "Karol Bagh",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110005",
    landmark: "Near Karol Bagh Metro Station (Blue Line Gate 4)",
    metroDistance: "Approx. 250m from Karol Bagh Metro Station",
    timings: "Tuesday – Sunday: 11:30 AM – 8:30 PM (Monday Closed)",
    googleMapsSearchUrl: "https://share.google/4waa5sfwEQSqvlN8D",
  },
  
  // Google Ratings Info
  googleRating: {
    score: 4.9,
    reviewsCount: 380,
    ratingUrl: "https://share.google/4waa5sfwEQSqvlN8D",
  },
  
  // Anti-Refurbished Transparency Core Rules
  brandPillars: [
    {
      title: "100% Pre-Owned, Zero Refurbished",
      description: "We strictly sell original used phones. We never replace genuine factory parts with counterfeit aftermarket components.",
    },
    {
      title: "Transparent Battery Health",
      description: "True battery health reports shown upfront. We never use reprogramming boost chips or altered battery BMS boards.",
    },
    {
      title: "10-Point Live Device Testing",
      description: "Test OLED display, TrueTone, Face ID, camera sensors, and mic in front of you at our Karol Bagh store.",
    },
    {
      title: "Same-Day WhatsApp Enquiry",
      description: "Direct chat with our counter team to lock stock before visiting in person.",
    }
  ]
};

/**
 * Builds a direct WhatsApp click-to-chat URL with a pre-filled, URL-encoded message.
 */
export function getWhatsAppEnquiryUrl(
  productName?: string, 
  price?: number, 
  customMessage?: string
): string {
  // Clean phone number (digits only)
  const cleanNumber = SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
  
  let message = "";
  if (customMessage) {
    message = customMessage;
  } else if (productName && price) {
    message = `Hi Cortek Enterprises, I'm interested in the ${productName} (₹${price.toLocaleString('en-IN')}) listed on your website. Please confirm availability, battery health and store visit details.`;
  } else if (productName) {
    message = `Hi Cortek Enterprises, I'm interested in the ${productName} listed on your website. Please share current availability and details.`;
  } else {
    message = `Hi Cortek Enterprises, I'm visiting your website and would like to check current pre-owned phone stock available at your Karol Bagh store.`;
  }

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Format Indian Rupee Currency
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
