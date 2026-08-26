import React from 'react';
import { Chrome, Facebook, Instagram, Youtube } from 'lucide-react';
import { SITE_CONFIG } from '../../config/siteConfig';
import { WhatsAppIcon } from './WhatsAppButton';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p>© {new Date().getFullYear()} CORTEK ENTERPRISES. Karol Bagh, New Delhi.</p>
        <div className="flex flex-wrap items-center justify-center gap-2" aria-label="Social media links">
          <a href={SITE_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram" className="px-2.5 py-2 rounded-xl text-pink-400 hover:text-white hover:bg-pink-600 transition-colors flex items-center gap-1.5 font-semibold">
            <Instagram className="w-4 h-4" />
            <span>Instagram</span>
          </a>
          <a href={SITE_CONFIG.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="YouTube" className="px-2.5 py-2 rounded-xl text-red-400 hover:text-white hover:bg-red-600 transition-colors flex items-center gap-1.5 font-semibold">
            <Youtube className="w-4 h-4" />
            <span>YouTube</span>
          </a>
          <a href={SITE_CONFIG.whatsappCommunityUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp" className="px-2.5 py-2 rounded-xl text-emerald-400 hover:text-white hover:bg-emerald-600 transition-colors flex items-center gap-1.5 font-semibold">
            <WhatsAppIcon className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
          <a href={SITE_CONFIG.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook" className="px-2.5 py-2 rounded-xl text-blue-400 hover:text-white hover:bg-blue-600 transition-colors flex items-center gap-1.5 font-semibold">
            <Facebook className="w-4 h-4" />
            <span>Facebook</span>
          </a>
          <a href={SITE_CONFIG.googleReviewsUrl} target="_blank" rel="noopener noreferrer" aria-label="Google Ratings" title="Google Ratings" className="px-2.5 py-2 rounded-xl text-amber-400 hover:text-white hover:bg-amber-600 transition-colors flex items-center gap-1.5 font-semibold">
            <Chrome className="w-4 h-4" />
            <span>Google Ratings</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
