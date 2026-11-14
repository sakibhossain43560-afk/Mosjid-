'use client';

import React from 'react';
import { MosqueSettings } from '../lib/types';
import {
  QrCode,
  HeartHandshake,
  ShieldCheck,
  Lock,
  PlusCircle,
  MinusCircle,
  CalendarCheck,
  Settings as SettingsIcon,
  LogOut,
  Bell,
  Sparkles,
  Smartphone,
  Download,
} from 'lucide-react';

interface HeaderProps {
  settings: MosqueSettings;
  isAdmin: boolean;
  useBanglaDigits: boolean;
  onToggleDigits: () => void;
  onOpenDonation: () => void;
  onOpenQR: () => void;
  onOpenAdminAuth: () => void;
  onOpenAddIncome: () => void;
  onOpenAddExpense: () => void;
  onOpenQuickJummah: () => void;
  onOpenSettings: () => void;
  onAdminLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  isAdmin,
  useBanglaDigits,
  onToggleDigits,
  onOpenDonation,
  onOpenQR,
  onOpenAdminAuth,
  onOpenAddIncome,
  onOpenAddExpense,
  onOpenQuickJummah,
  onOpenSettings,
  onAdminLogout,
}) => {
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);

  React.useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      alert(
        'আপনার মোবাইল বা কম্পিউটারে অ্যাপ হিসেবে সেভ করতে:\n১. ব্রাউজারের থ্রি-ডট (⋮) অপশনে চাপ দিন\n২. "Install app" বা "Add to Home screen"-এ ক্লিক করুন।'
      );
    }
  };
  return (
    <header className="bg-gradient-to-b from-mosque-900 via-mosque-800 to-mosque-950 text-white shadow-xl relative overflow-hidden">
      {/* Subtle Islamic pattern background effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

      {/* Top micro bar */}
      <div className="border-b border-mosque-700/60 bg-mosque-950/40 text-xs py-1.5 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-mosque-200">
            <span className="font-serif italic text-gold-300">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            <span className="hidden sm:inline text-mosque-400">|</span>
            <span className="hidden sm:inline text-mosque-200 font-medium">
              স্বচ্ছ আর্থিক পোর্টাল ও হিসাব খাতা
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Numeral Toggle Button */}
            <button
              onClick={onToggleDigits}
              title="সংখ্যা ফরম্যাট পরিবর্তন (১২৩ বা 123)"
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-mosque-800/80 hover:bg-mosque-700 text-gold-200 text-xs border border-mosque-600/50 transition-colors"
            >
              <span>সংখ্যা:</span>
              <span className="font-bold">{useBanglaDigits ? '১২৩ (বাংলা)' : '123 (Eng)'}</span>
            </button>

            {/* Admin status pill */}
            {isAdmin ? (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                কমিটি মোড
              </span>
            ) : (
              <button
                onClick={onOpenAdminAuth}
                className="flex items-center gap-1 text-mosque-300 hover:text-white transition-colors"
              >
                <Lock className="w-3 h-3" />
                <span>কমিটি লগইন</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Mosque Info */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-gold-500 to-gold-400 p-0.5 shadow-lg flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-mosque-900 rounded-[14px] flex items-center justify-center text-2xl sm:text-3xl">
                  🕌
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>{settings.mosqueName}</span>
                </h1>
                {settings.mosqueArabicName && (
                  <p className="text-gold-300 font-serif text-sm sm:text-base tracking-wide">
                    {settings.mosqueArabicName}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-mosque-200 pt-1">
              <span>📍 {settings.mosqueAddress}</span>
              {settings.establishedYear && (
                <>
                  <span className="text-mosque-500">•</span>
                  <span>স্থাপিত: {settings.establishedYear} খ্রি.</span>
                </>
              )}
            </div>
          </div>

          {/* Quick Action Buttons for Musallis & Visitors */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Donate Online Button */}
            <button
              onClick={onOpenDonation}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-mosque-950 font-bold shadow-lg shadow-gold-900/30 active:scale-95 transition-all text-sm sm:text-base"
            >
              <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 text-mosque-950" />
              <span>দান করুন</span>
            </button>

            {/* QR Code Poster Generator Button */}
            <button
              onClick={onOpenQR}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-mosque-800/80 hover:bg-mosque-700 text-white font-semibold border border-mosque-600/70 shadow active:scale-95 transition-all text-sm"
              title="মসজিদের নোটিশ বোর্ডে লাগানোর জন্য কিউআর কোড পোস্টার"
            >
              <QrCode className="w-4 h-4 text-gold-300" />
              <span>কিউআর পোস্টার</span>
            </button>

            {/* Install as Mobile App Button */}
            <button
              onClick={handleInstallApp}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 font-semibold border border-emerald-600/70 shadow active:scale-95 transition-all text-xs sm:text-sm"
              title="ফোনে মোবাইল অ্যাপ হিসেবে ইনস্টল করুন"
            >
              <Smartphone className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">অ্যাপ ইনস্টল</span>
              <span className="sm:hidden">অ্যাপ</span>
            </button>

            {/* Admin Toggle / Logout */}
            {isAdmin ? (
              <button
                onClick={onAdminLogout}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-900/40 hover:bg-red-800/60 text-red-200 border border-red-700/50 font-medium text-xs sm:text-sm transition-all"
                title="কমিটি মোড থেকে লগআউট"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">লগআউট</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminAuth}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-mosque-800/50 hover:bg-mosque-700/70 text-mosque-200 hover:text-white border border-mosque-700/50 text-xs sm:text-sm font-medium transition-all"
              >
                <Lock className="w-4 h-4 text-mosque-300" />
                <span>অ্যাডমিন</span>
              </button>
            )}
          </div>
        </div>

        {/* Committee Quick Admin Toolbar when logged in */}
        {isAdmin && (
          <div className="mt-6 pt-4 border-t border-mosque-700/70">
            <div className="bg-mosque-950/70 rounded-2xl p-3 sm:p-4 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-2 text-emerald-300 text-sm font-semibold">
                <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
                <span>কমিটি ড্যাশবোর্ড সক্রিয়:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={onOpenAddIncome}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-colors shadow"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ নতুন আয়</span>
                </button>

                <button
                  onClick={onOpenAddExpense}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm transition-colors shadow"
                >
                  <MinusCircle className="w-4 h-4" />
                  <span>- নতুন ব্যয়</span>
                </button>

                <button
                  onClick={onOpenQuickJummah}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-600 hover:bg-gold-500 text-white font-semibold text-xs sm:text-sm transition-colors shadow"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>🕌 জুমার এন্ট্রি</span>
                </button>

                <button
                  onClick={onOpenSettings}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-mosque-800 hover:bg-mosque-700 text-mosque-200 hover:text-white border border-mosque-600 text-xs sm:text-sm transition-colors"
                  title="মসজিদের তথ্য ও সেটিংস পরিবর্তন"
                >
                  <SettingsIcon className="w-4 h-4" />
                  <span>সেটিংস</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notice Banner */}
        {settings.noticeActive && settings.noticeText && (
          <div className="mt-4 p-3 rounded-xl bg-gold-500/15 border border-gold-400/30 text-gold-100 flex items-start gap-2.5 text-xs sm:text-sm backdrop-blur-sm">
            <Bell className="w-4 h-4 text-gold-400 shrink-0 mt-0.5 animate-bounce" />
            <div className="leading-relaxed">
              <strong className="font-semibold text-gold-300 mr-1.5">বিশেষ ঘোষণা:</strong>
              {settings.noticeText}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
