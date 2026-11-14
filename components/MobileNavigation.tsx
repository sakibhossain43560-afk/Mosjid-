'use client';

import React from 'react';
import {
  Home,
  CalendarCheck,
  FileText,
  PlusCircle,
  Menu,
  QrCode,
  HeartHandshake,
} from 'lucide-react';

export type AppPage = 'home' | 'jummah' | 'ledger' | 'add' | 'menu';

interface MobileNavigationProps {
  currentPage: AppPage;
  onSelectPage: (page: AppPage) => void;
  isAdmin: boolean;
  onOpenAddIncome: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentPage,
  onSelectPage,
  isAdmin,
  onOpenAddIncome,
}) => {
  return (
    <nav
      aria-label="মোবাইল প্রধান ন্যাভিগেশন"
      className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 text-slate-400 py-1.5 px-3"
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* 1. Home */}
        <button
          onClick={() => onSelectPage('home')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentPage === 'home'
              ? 'text-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">হোম</span>
        </button>

        {/* 2. Jummah */}
        <button
          onClick={() => onSelectPage('jummah')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentPage === 'jummah'
              ? 'text-gold-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CalendarCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">জুমা</span>
        </button>

        {/* 3. Center Add Action Button */}
        <button
          onClick={() => onSelectPage('add')}
          className="flex-1 flex flex-col items-center justify-center -mt-4 py-1"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-950/50 border-2 border-slate-900 active:scale-95 transition-transform">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-emerald-400 mt-0.5">এন্ট্রি</span>
        </button>

        {/* 4. Ledger */}
        <button
          onClick={() => onSelectPage('ledger')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentPage === 'ledger'
              ? 'text-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">হিসাব</span>
        </button>

        {/* 5. Menu */}
        <button
          onClick={() => onSelectPage('menu')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentPage === 'menu'
              ? 'text-emerald-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">মেনু</span>
        </button>
      </div>
    </nav>
  );
};
