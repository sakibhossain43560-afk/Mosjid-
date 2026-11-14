import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'মসজিদ হিসাব - উন্মুক্ত আর্থিক পোর্টাল',
    short_name: 'মসজিদ হিসাব',
    description: 'মসজিদের সকল আয়, ব্যয় ও জুমার কালেকশনের উন্মুক্ত হিসাব ব্যবস্থাপনা অ্যাপ',
    start_url: '/',
    display: 'standalone',
    background_color: '#064e3b',
    theme_color: '#065f46',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
