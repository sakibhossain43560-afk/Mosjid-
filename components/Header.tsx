'use client';

import React from 'react';
import { MosqueSettings } from '../lib/types';
import {
  Landmark,
  ShieldCheck,
  Lock,
  LogOut,
  QrCode,
  HeartHandshake,
  Smartphone,
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
  onAdminLogout,
}) => {
  return (
    <header className="bg-emerald-900 text-white px-4 py-3.5 shadow-md sticky top-0 z-30">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Left: Mosque Info */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-800/90 border border-emerald-700 flex items-center justify-center text-gold-400 shrink-0 shadow-sm">
            <Landmark className="w-5 h-5 text-gold-400" />
          </div>

          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight leading-tight line-clamp-1">
              {settings.mosqueName}
            </h1>
            <p className="text-[11px] text-emerald-200 line-clamp-1">
              {settings.mosqueAddress}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {/* Digits Toggle */}
          <button
            onClick={onToggleDigits}
            className="px-2 py-1 rounded-lg bg-emerald-800/80 text-gold-300 text-[11px] font-bold border border-emerald-700/60"
            title="সংখ্যা ফরম্যাট পরিবর্তন"
          >
            {useBanglaDigits ? '১২৩' : '123'}
          </button>

          {/* Admin Status Pill */}
          {isAdmin ? (
            <button
              onClick={onAdminLogout}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-900/60 text-rose-200 border border-rose-700/60 text-[11px] font-bold"
              title="লগআউট"
            >
              <LogOut className="w-3 h-3" />
              <span>লগআউট</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminAuth}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-[11px] font-bold border border-emerald-700/60"
            >
              <Lock className="w-3 h-3" />
              <span>লগইন</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
